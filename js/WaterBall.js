;(function() {

	"use strict";

	var root = this

	var has_require = typeof require !== 'undefined'

	var THREE = root.THREE || has_require && require('three')
	if( !THREE )
		throw new Error( 'WaterBall necessita della three.js' )

var waterMaterial;

function WaterBall(camera){
	this.textureDiff 	= new THREE.TextureLoader().load( 'images/Water2.jpg' );
	this.DUVWater		= new THREE.TextureLoader().load( 'images/DUVWater2.png' );
	this.water			= null;
	this.totalTime		= 0;
	this.time			= 0;
	this.nullo			= new THREE.Vector3(0,0,0);
	this.videoTexture 	= new THREE.VideoTexture( arToolkitSource.domElement );
	//this.videoTexture.minFilter = THREE.LinearFilter;
	this.videoTexture.wrapS = THREE.ClampToEdgeWrapping;
	this.videoTexture.wrapT = THREE.ClampToEdgeWrapping;
	this.videoTexture.repeat.set(8,1);
	this.DUVWater.wrapS = THREE.RepeatWrapping;
	this.DUVWater.wrapT = THREE.RepeatWrapping;
	
	function updateTextureMatrix( camera ) {
		var m = new THREE.Matrix4();
		m.set(
			0.5, 0.0, 0.0, 0.5,
			0.0, 0.5, 0.0, 0.5,
			0.0, 0.0, 0.5, 0.5,
			0.0, 0.0, 0.0, 1.0
		);
		m.multiply( camera.projectionMatrix );
		m.multiply( camera.matrixWorldInverse );
		return m;
	}

	
	waterMaterial = new THREE.ShaderMaterial({
	uniforms: {
			time			: { value: 0	},
			timeWave		: { value: 0	},
			tDiffuse 		: { value: this.textureDiff},
			tDudv			: { value: this.DUVWater},
			textureMatrix	: { value: updateTextureMatrix(camera)},
			texture			: { value: this.videoTexture },
			refractionRatio	: { value: 0.75 },
			distancez		: { value: 0.5 },
			opacity			: { value: 0.8 },
			tint			: { value: new THREE.Vector3(0.8, 0.8, 1.0) },
			posObj			: { value: new THREE.Vector3(0.0, 1.0, 0.0) },
			lColor			: { value: new THREE.Color(1.0, 1.0, 1.0) },
			collision		: { value: 0 }
			
	},	vertexShader: "uniform sampler2D tDudv;\n"+
			"uniform mat4 textureMatrix;\n"+
			"uniform float refractionRatio;\n"+
			"uniform float time;\n"+
			"varying float waveSpeed;\n"+
			"varying float waveStrength;\n"+
			"uniform float timeWave;\n"+
			"uniform int collision;\n"+
			"uniform vec3 posObj;\n"+
			"varying vec2 vUv;\n"+
			"varying vec2 distortedUv;\n"+
			"varying vec3 vRefract;\n"+
			"varying vec3 vNormal;\n"+
			"varying vec3 vPosition;\n"+
			"varying vec3 vPos;\n"+
			"varying vec3 distortion;\n"+
			"varying vec4 vUvRefraction;\n"+
			"float co=1.07;\n"+
			"void onda(){"+
			"	float dist = distance(posObj, (modelMatrix * vec4(position,1.0)).xyz);"+
			"	float min   = 0.09 + mod(timeWave,1.0);"+
			"	float maxim = 0.16 + mod(timeWave,1.0);"+
			"	co-= mod(timeWave,1.0)/15.0;\n"+
			"	if(dist<maxim && dist>min  && collision==1){"+
			"		gl_Position 		= projectionMatrix * modelViewMatrix * vec4( co*(position+distortion), 1.0 ); "+
			"		distortion			=  co*(position+distortion);\n"+
			"	}else if(dist<maxim+0.02 && dist>min-0.02  && collision==1){"+
			"		gl_Position 		= projectionMatrix * modelViewMatrix * vec4( (co-((co-1.0)/3.0*2.0))*(position+distortion), 1.0 ); "+
			"		distortion			=  co-((co-1.0)/3.0*2.0)*(position+distortion);\n"+
			"	}else if(dist<maxim+0.04 && dist>min-0.04  && collision==1){"+
			"		gl_Position 		= projectionMatrix * modelViewMatrix * vec4( (co-((co-1.0)/5.0*4.0))*(position+distortion), 1.0 ); "+
			"		distortion			=  co-((co-1.0)/5.0*4.0)*(position+distortion);\n"+
			"	}else"+
			"		gl_Position 		= projectionMatrix * modelViewMatrix * vec4( (position)+distortion, 1.0 ); "+
			"	distortion				=  (position+distortion);"+
			"}"+
			"void main() {"+
				"waveStrength = 0.05;\n"+
				"waveSpeed	   = 0.1;\n"+
				"vUv = 2.0*uv;\n"+
				"vec4 mPosition 	= modelMatrix * vec4( position, 1.0 );"+
				"vec3 nWorld 		= normalize( mat3( modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz ) * normal );"+
				"vRefract 	  		= normalize( refract( normalize( mPosition.xyz - cameraPosition ), nWorld, refractionRatio ) );"+
				"distortedUv 		= texture2D( tDudv, vec2( vUv.x , vUv.y+time*waveSpeed ) ).rg * waveStrength;\n"+
				"distortedUv 		= vUv.xy + vec2( distortedUv.x+time*waveSpeed, distortedUv.y  );"+
				"distortion 		= ( texture2D( tDudv, distortedUv ).rgb * 0.40 - 0.2 ) * waveStrength;\n"+
				"vPosition 			= (modelViewMatrix * vec4( normal+distortion+position, 1.0 )).xyz;\n"+
				"vNormal 			= normalize(normalMatrix * normal+distortion);"+
				"vUvRefraction 		= textureMatrix * vec4( position, 1.0 );"+
				"onda();"+
				"vPos 				= vec4( distortion, 1.0 ).xyz;\n"+
				"}\n",
		fragmentShader: "#extension GL_OES_standard_derivatives : enable\n"+
			"uniform sampler2D tDiffuse;\n"+
			"uniform sampler2D texture;\n"+
			"uniform sampler2D tDudv;\n"+
			"uniform float time;\n"+
			"uniform float distancez;\n"+
			"uniform float opacity;\n"+
			"uniform vec3 tint;\n"+
			"uniform vec3 lColor;\n"+
			"varying float waveSpeed;\n"+
			"varying float waveStrength;\n"+
			"varying vec2 vUv;\n"+
			"varying vec2 distortedUv;\n"+
			"varying vec3 vRefract;\n"+
			"varying vec3 vNormal;\n"+
			"varying vec3 vPosition;\n"+
			"varying vec3 vPos;\n"+
			"varying vec3 distortion;\n"+
			"varying vec4 vUvRefraction;\n"+
			"vec3 zero = vec3(0.0);\n"+
			"vec3 getAverage(sampler2D t){"+
			"	vec3 rgb=vec3(0.0);"+
			"	for (float i = 0.0; i < 15.0; i++) {"+
			"		for (float j = 0.0; j < 15.0; j++) {"+
			"			rgb += texture2D(t,vec2(i/15.0,j/15.0)).rgb;\n"+
			"		}"+
			"	}"+
			"	return normalize(rgb);"+
			"}"+	
			"vec3 perturbNormal2Arb( vec3 eye_pos, vec3 surf_norm ) {"+
			"		vec3 q0 = dFdx( eye_pos.xyz );"+
			"		vec3 q1 = dFdy( eye_pos.xyz );"+
			"		vec2 st0 = dFdx( vUv.st );"+
			"		vec2 st1 = dFdy( vUv.st );"+
			"		vec3 S = normalize(  -q0 * st1.s + q1 * st0.t );"+
			"		vec3 T = normalize(  q0 * st1.s - q1 * st0.t );"+
			"		vec3 N =  surf_norm ;\n"+
			"		mat3 tsn = mat3( S, T, N );"+
			"		return normalize( tsn * vec3(1.0) );"+
			"}"+
			"void main() {"+
			"	vec2 p = vec2( vRefract.x * distancez + 0.5, vRefract.y * distancez + 0.5 );"+
			"	p = vec2(1.0, 1.0) - p;\n"+	
			"	vec2 distortedUv = texture2D( tDudv, vec2( vUv.x, vUv.y  + time * waveSpeed) ).rg * waveStrength;\n"+
			"	distortedUv = vUv.xy + vec2( distortedUv.x + time * waveSpeed  , distortedUv.y);"+
			"	vec2 distortion = ( texture2D( tDudv, distortedUv ).rg * 1.0 - 0.5 ) * waveStrength;\n"+
			"	vec4 uv = vec4( vUvRefraction );"+
			"	uv.xy += distortion;\n"+
			"	vec3 l = normalize(- vPosition.xyz);"+
			"	vec3 n = perturbNormal2Arb( vPosition, normalize( vNormal ));;"+
			"	float NdotL1  = 1.0-(min(0.5,max(dot(n, l), (0.0))))*2.;"+
			"	float NdotL2  = 1.0-(min(0.5,max(dot(n, l), (0.0))))*0.25;\n"+
			"	float NdotL3  = max(0.0,(min(0.25,0.3-max(dot(n, l), (0.0)))));"+
			"	vec3 color = texture2D( texture, p+distortion/2.0 ).rgb;\n"+
			"	vec3 base = (texture2D( tDiffuse, uv.xy)).rgb;\n"+
			"	vec3 inside  = (1.0-NdotL1)*(0.7*color+0.6*base) ;\n"+
			"	vec3 outside = NdotL1*(0.4*color+0.8*base)+getAverage(texture)*NdotL3;\n"+
			"	float dis = distance(vPos.xyz, zero.xyz);\n"+
			"	if(dis>1.1){ inside+=(vec3(dis/100.0)); outside+=(vec3(dis/75.0));}\n"+
			"	gl_FragColor = vec4((((inside+outside))/3.*2.+normalize(lColor)*(inside+outside)/3.), NdotL2*NdotL2*opacity + NdotL3/5.);"+
			"}\n",
		transparent: true
		});
	this.water = new THREE.Mesh(new THREE.SphereGeometry(1, 256,256), waterMaterial);
	this.water.material.shading = THREE.SmoothShading;
	this.water.geometry.computeVertexNormals(true);
	this.water.castShadow = true;
	this.water.receiveShadow = true;
	}
	
	WaterBall.prototype.update = function(deltaTime,hit,lightColor){
			
			this.totalTime += deltaTime;
			this.water.material.uniforms.time.value = this.totalTime;
			this.water.material.uniforms.lColor.value = lightColor;
			if(hit){
				this.time = 0;
				this.water.material.uniforms.posObj.value = hit;
				this.water.material.uniforms.collision.value = 1;
				this.water.material.uniforms.timeWave.value = (this.time=this.time+deltaTime);
				
			}else{
				if(this.time>=0.95){
					this.time=0;
					this.water.material.uniforms.posObj.value = this.nullo;
					this.water.material.uniforms.collision.value = 0;
					this.water.material.uniforms.timeWave.value  = 0;
				}else
					this.water.material.uniforms.timeWave.value = (this.time=this.time+deltaTime);
			}
	}
	
	WaterBall.prototype.getObject = function(){
		return this.water;
	}
	
	
	WaterBall.prototype.move = function(x,y,z){
		this.water.position.set(x,y,z);
	}
	
	WaterBall.prototype.moveX = function(val){
		this.water.position.x = val;
	}
	
	WaterBall.prototype.moveY = function(val){
		this.water.position.y = val;
	}
	
	WaterBall.prototype.moveZ = function(val){
		this.water.position.z = val;
	}
	
	if( typeof exports !== 'undefined' ) {
		if( typeof module !== 'undefined' && module.exports ) {
			exports = module.exports = WaterBall
		}
		exports.WaterBall = WaterBall
	}
	else {
		root.WaterBall = WaterBall
	}

}).call(this);