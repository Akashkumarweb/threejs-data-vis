import { useEffect, useRef } from 'react';

import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import ThreeGlobe from 'three-globe';

import countries from './files/globe-data-min.json';


const Globe = () => {
  const globeRef = useRef(null);
  const renderer = useRef(new THREE.WebGLRenderer({ antialias: true }));
  const camera = useRef(new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000));
  const scene = useRef(new THREE.Scene());
  const controls = useRef();

  // Sample data representing union members in different parts of the UK
  const unionMembersData = [
    { name: "London", lat: 51.5074, lng: -0.1278, members: Math.floor(Math.random() * 5000) },
    { name: "Manchester", lat: 53.4808, lng: -2.2426, members: Math.floor(Math.random() * 3000) },
    // { name: "Edinburgh", lat: 55.9533, lng: -3.1883, members: Math.floor(Math.random() * 2000) },
    { name: "Glasgow", lat: 55.8642, lng: -4.2518, members: Math.floor(Math.random() * 2500) }
  ];

  useEffect(() => {
    const initScene = () => {
      renderer.current.setPixelRatio(window.devicePixelRatio);
      renderer.current.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(renderer.current.domElement);
      document.body.style.overflow = 'hidden';

      scene.current.background = new THREE.Color(0x000000);
      scene.current.add(new THREE.AmbientLight(0xffffff, 0.5));
      const dirLight = new THREE.DirectionalLight(0xffffff, 1);
      dirLight.position.set(5, 3, 4);
      scene.current.add(dirLight);

      camera.current.position.set(-20, 180, 130);
      controls.current = new OrbitControls(camera.current, renderer.current.domElement);
      controls.current.enableDamping = true;
      controls.current.dampingFactor = 0.05;
      controls.current.enableZoom = true;
      controls.current.autoRotate = false;
      controls.current.minDistance = 50;
      controls.current.maxDistance = 500;
    };

    const initGlobe = () => {
      const globe = new ThreeGlobe({ animateIn: true })
        .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg') // Globe texture
        .hexPolygonsData(countries.features)  // Hexagonal polygons data
        .hexPolygonResolution(3)
        .hexPolygonMargin(0.7)
        .hexPolygonColor(e => ["GBR"].includes(e.properties.ISO_A3) ? 'rgba(255,215,0, 1)' : 'rgba(255,255,255, 0.6)') // Highlight UK
        .showAtmosphere(true)
        .atmosphereColor('#3a228a')
        .atmosphereAltitude(0.3)
        // Points data for union members
        .pointsData(unionMembersData)
        .pointAltitude(0.01)
        .pointColor(() => '#ffcc00')
        .pointRadius(0.5)
        .labelsData(unionMembersData)  // Adding labels for each point
        .labelLat(d => d.lat)
        .labelLng(d => d.lng)
        .labelText(d => `${d.name}: ${d.members} members`)
        .labelColor(() => 'white')
        .labelSize(0.5)
        .labelAltitude(0.02);

      scene.current.add(globe);
    };

    initScene();
    initGlobe();

    const animate = () => {
      renderer.current.render(scene.current, camera.current);
      requestAnimationFrame(animate);
    };
    animate();

    const onWindowResize = () => {
      camera.current.aspect = window.innerWidth / window.innerHeight;
      camera.current.updateProjectionMatrix();
      renderer.current.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onWindowResize);

    return () => {
      document.body.removeChild(renderer.current.domElement);
      window.removeEventListener('resize', onWindowResize);
    };
  }, []);

  return <div ref={globeRef} />;
};

export default Globe;
