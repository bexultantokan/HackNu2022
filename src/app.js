import { Loader } from '@googlemaps/js-api-loader';
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import { arraySlice } from 'three/src/animation/AnimationUtils';
import data from './data.json' assert { type: 'JSON' };

const apiOptions = {
  apiKey: 'AIzaSyAFLm6pxRxzVFyMTF5Qcf7VXbBrRl30Bcc',
  version: "beta"
};
var dev = "dev7", activity = data[dev][0]["Activity"];
var hor = parseFloat(data[dev][0]["Horizontal accuracy"]), ver = parseFloat(data[dev][0]["Vertical accuracy"]);
console.log(activity)

var lat = parseFloat(data[dev][0]["Latitude"]), lng = parseFloat(data[dev][0]["Longitude"]), alt = parseFloat(data[dev][0]["Altitude"]);
console.log(lat, lng, alt)

var mapOptions = {
  "tilt": 0,
  "heading": 0,
  "zoom": 19,
  "center": { lat: lat, lng: lng},
  "mapId": "aefaea4f3dc4c18e"    
}



var time = []
for (var i = 0; i < Object.keys(data[dev]).length; i++) {
  time.push([parseFloat(data[dev][i]["Latitude"]),parseFloat(data[dev][i]["Longitude"]),parseFloat(data[dev][i]["Altitude"])]);
  lat = time[i][0];
  lng = time[i][1];
  alt = time[i][2];
}

async function initMap() {    
  const mapDiv = document.getElementById("map");
  const apiLoader = new Loader(apiOptions);
  await apiLoader.load();
  const map = new google.maps.Map(mapDiv, mapOptions);

  return map;
}


function initWebGLOverlayView(map) {  
  let scene, renderer, camera, loader, scene1;
  const webGLOverlayView = new google.maps.WebGLOverlayView();
 
  
  webGLOverlayView.onAdd = () => {   
    // set up the scene
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera();
    const ambientLight = new THREE.AmbientLight( 0xffffff, 0.75 ); // soft white light
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.25);
    directionalLight.position.set(0.5, -1, 0.5);    
    scene.add(directionalLight.target);


    // load the model    
    if(activity=="swimming"){
      loader = new GLTFLoader();               
  const source = "temp/swim.gltf";
  loader.load(
    source,
    gltf => {      
      gltf.scene.scale.set(1,1,1);
      
      gltf.scene.rotation.x = 0 * Math.PI/180; // rotations are in radians
      gltf.scene.rotation.y = 0* Math.PI/180;
      gltf.scene.rotation.z = 90 * Math.PI/180;
      scene.add(gltf.scene);           
    }
  );
    }
    else if(activity=="walking"){
      loader = new GLTFLoader();               
      const source = "temp/male.gltf";
      loader.load(
      source,
      gltf => {      
      gltf.scene.scale.set(7,7,7);
      
      gltf.scene.rotation.x = -180 * Math.PI/180; // rotations are in radians
      gltf.scene.rotation.y = 270* Math.PI/180;
      gltf.scene.rotation.z = 90 * Math.PI/180;
      scene.add(gltf.scene);           
    }
  );
  }else if(activity=="running"){
    loader = new GLTFLoader();               
  const source = "temp/run.gltf";
  loader.load(
    source,
    gltf => {      
      gltf.scene.scale.set(0.08,0.08,0.08);
      gltf.scene.rotation.x = -180 * Math.PI/180; // rotations are in radians
      gltf.scene.rotation.y = 270* Math.PI/180;
      gltf.scene.rotation.z = 90 * Math.PI/180;
      scene.add(gltf.scene);           
    }
  );
  }else if(activity=="cycling"){
    loader = new GLTFLoader();               
    const source = "temp/cycling.gltf";
    loader.load(
      source,
      gltf => {      
        gltf.scene.scale.set(25,25,25);
        
        gltf.scene.rotation.x = -180 * Math.PI/180; // rotations are in radians
        gltf.scene.rotation.y = 270* Math.PI/180;
        gltf.scene.rotation.z = 90 * Math.PI/180;
        scene.add(gltf.scene);           
      }
    );
    
    
  }else if(activity=="driving"){
    loader = new GLTFLoader();               
  const source = "temp/car.gltf";
  loader.load(
    source,
    gltf => {      
      gltf.scene.scale.set(10,10,10);
      
      gltf.scene.rotation.x = 90 * Math.PI/180; // rotations are in radians
      gltf.scene.rotation.y = 180* Math.PI/180;
      gltf.scene.rotation.z = 0 * Math.PI/180;
      scene.add(gltf.scene);          
    }
  );
  }else{
    loader = new GLTFLoader();               
      const source = "temp/male.gltf";
      loader.load(
        source,
        gltf => {      
          gltf.scene.scale.set(7,7,7);
          
          gltf.scene.rotation.x = -180 * Math.PI/180; // rotations are in radians
          gltf.scene.rotation.y = 270* Math.PI/180;
          gltf.scene.rotation.z = 90 * Math.PI/180;
          scene.add(gltf.scene);
                   
        }
      );
  }
  scene1 = new THREE.Scene();
  scene1.scale.set(hor,hor, ver);
  const geometry = new THREE.SphereGeometry( 1, 20, 20 );
  const material = new THREE.MeshBasicMaterial( { color: 0x44ffff , transparent: true, opacity: 0.3} );
  const sphere = new THREE.Mesh( geometry, material );
  scene1.add( sphere );

}
  
  webGLOverlayView.onContextRestored = ({gl}) => {    
    // create the three.js renderer, using the
    // maps's WebGL rendering context.
    renderer = new THREE.WebGLRenderer({
      canvas: gl.canvas,
      context: gl,
      ...gl.getContextAttributes(),
    });
    renderer.autoClear = false;

    // loader.manager.onLoad = () => {        
    //   renderer.setAnimationLoop(() => {
    //     map.moveCamera({
    //       "tilt": mapOptions.tilt,
    //       "heading": mapOptions.heading,
    //       "zoom": mapOptions.zoom
    //     });          
        
    //     // rotate the map 360 degrees 
    //     if (mapOptions.tilt < 67.5) {
    //       mapOptions.tilt += 0.5
    //     } else if (mapOptions.heading <= 360) {
    //       mapOptions.heading += 0.2;
    //     } else {
    //       renderer.setAnimationLoop(null)
    //     }
    //   });       
    // }
  }

  webGLOverlayView.onDraw = ({gl, transformer}) => {
    // update camera matrix to ensure the model is georeferenced correctly on the map
    const latLngAltitudeLiteral = {
        lat: mapOptions.center.lat,
        lng: mapOptions.center.lng,
        altitude: alt
    }
    const matrix = transformer.fromLatLngAltitude(latLngAltitudeLiteral);
    camera.projectionMatrix = new THREE.Matrix4().fromArray(matrix);

    // render();
    webGLOverlayView.requestRedraw();  
    renderer.render(scene, camera);
    renderer.render(scene1, camera);                   

    // always reset the GL state
    renderer.resetState();
  }


  webGLOverlayView.setMap(map);
}

(async () => {        
  const map = await initMap();
  initWebGLOverlayView(map);    
})();



