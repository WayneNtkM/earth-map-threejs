'use client';

import React, { useEffect } from 'react';
import * as THREE from 'three';

export default function Home() {
  useEffect(() => {
    let targetRotationX = 0.05;
    let targetRotationY = 0.02;
    let mouseX = 0, mouseXOnMouseDown = 0, mouseY = 0, mouseYOnMouseDown = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;
    const slowingFactor = 0.98;
    const dragFactor = 0.0002;
  
    function onDocumentMouseDown( event: THREE.Event ) {
        event.preventDefault();
        console.log('1', event);
        document.addEventListener('mousemove', onDocumentMouseMove, false );
        document.addEventListener('mouseup', onDocumentMouseUp, false );
        mouseXOnMouseDown = event.clientX - windowHalfX;
        mouseYOnMouseDown = event.clientY - windowHalfY;
    }

    function onDocumentTouchEnd( event: THREE.Event ) {
      event.preventDefault();
      console.log('2', event);
      document.addEventListener('touchmove', onDocumentTouchMove, false );
      document.addEventListener('touchend', onDocumentTouchEnd, false );
      mouseXOnMouseDown = event.clientX - windowHalfX;
      mouseYOnMouseDown = event.clientY - windowHalfY;
  }
  
    function onDocumentMouseMove( event: THREE.Event ) {
        mouseX = event.clientX - windowHalfX;
        targetRotationX = ( mouseX - mouseXOnMouseDown ) * dragFactor;
        mouseY = event.clientY - windowHalfY;
        targetRotationY = ( mouseY - mouseYOnMouseDown ) * dragFactor;
    }

    function onDocumentTouchMove( event: THREE.Event ) {
      console.log('3', event);
      
      mouseX = event.clientX - windowHalfX;
      targetRotationX = ( mouseX - mouseXOnMouseDown ) * dragFactor;
      mouseY = event.clientY - windowHalfY;
      targetRotationY = ( mouseY - mouseYOnMouseDown ) * dragFactor;
  }
  
    function onDocumentMouseUp( event: THREE.Event ) {
        document.addEventListener('touchmove', onDocumentMouseMove, false );
        document.addEventListener('touchend', onDocumentMouseUp, false );
    }

    function onDocumentTouchStart( event: THREE.Event ) {
      document.addEventListener('touchmove', onDocumentTouchMove, false );
      document.addEventListener('touchend', onDocumentTouchEnd, false );
  }
  
    function main() {
        const scene = new THREE.Scene();
        const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#globe') as HTMLCanvasElement });
        renderer.setSize(window.innerWidth, window.innerHeight);
  
        // create earthGeometry
        const earthGeometry = new THREE.SphereGeometry(1, 32, 32);
        const texture = new THREE.TextureLoader().load('./earthmap.jpeg');
        texture.wrapS = THREE.RepeatWrapping;
        texture.offset.x = 1.5708 / (2 * Math.PI);
  
        const earthMaterial = new THREE.MeshPhongMaterial({
            map: texture,
            bumpMap: new THREE.TextureLoader().load('./earthbump.jpeg'),
            bumpScale: 0.01,
        });
        const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
        scene.add(earthMesh);
  
        // set ambientlight
        const ambientlight = new THREE.AmbientLight(0xffffff, 0.05);
        scene.add(ambientlight);
        // set point light
        const pointerlight =  new THREE.PointLight(0xffffff, 0.6);
        // set light position
        pointerlight.position.set(10, 3, 5);
        scene.add(pointerlight);
        
        const mesh = new THREE.Mesh(
            new THREE.SphereGeometry(0.005, 2, 2),
            new THREE.MeshBasicMaterial({ color: 0xfff0000 })
        );
  
        function calculate(userLat = 48.864716, userLng = -2.349014) {
            const lat = (userLat / 180) * Math.PI;
            const lng = (userLng / 180) * Math.PI;
  
            const z = Math.cos(lat) * Math.cos(lng);
            const x = Math.cos(lat) * Math.sin(lng);
            const y = Math.sin(lat);
  
            return { x, y, z };
        }
  
        const { x, y, z } = calculate();
  
        mesh.position.set(x, y, z);
  
  
        earthMesh.add(mesh);

        const viewW = Math.round((64 * window.innerWidth) / 1400);
        const viewh = (64 * window.innerHeight) / 740;

        console.log(window.innerWidth);
  
        // create cloudGeometry
        const cloudGeometry =  new THREE.SphereGeometry(1.027, viewW, viewh);
        const cloudMaterial = new THREE.MeshPhongMaterial({
            map: new THREE.TextureLoader().load('./earthCloud.png'),
            transparent: true
        });
        const cloudMesh = new THREE.Mesh(cloudGeometry,cloudMaterial);
        scene.add(cloudMesh);
  
        // create starGeometry
        const starGeometry =  new THREE.SphereGeometry(5, 64, 64);
        const starMaterial = new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load('./galaxy.png'),
            side: THREE.BackSide
        });
  
        const starMesh = new THREE.Mesh(starGeometry,starMaterial);
        scene.add(starMesh);
  
        // Add the camera
        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 4;
  
        const render = () => {
            earthMesh.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), targetRotationX);
            earthMesh.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), targetRotationY);
            cloudMesh.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), targetRotationX);
            cloudMesh.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), targetRotationY);
            mesh.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), targetRotationX);
            mesh.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), targetRotationY);
            targetRotationY = targetRotationY * slowingFactor;
            targetRotationX = targetRotationX * slowingFactor;
            renderer.render(scene,camera);
        }
        const animate = () => {
            requestAnimationFrame(animate);
            render();
        }
        animate();
        document.addEventListener('mousedown', onDocumentMouseDown, false);
        document.addEventListener('touchend', onDocumentMouseDown, false);
    }
    window.onload = main;
  }, []);

  return (
    <canvas id='globe'></canvas>
  )
}
