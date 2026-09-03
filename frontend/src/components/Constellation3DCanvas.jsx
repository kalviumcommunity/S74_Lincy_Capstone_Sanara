import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const COLOR_PALETTE = {
  root: { main: 0x25678B, glow: 0x73C5EA, text: "#FFFFFF" },
  theme: { main: 0xB8B2D6, glow: 0x8DD8E8, text: "#B8B2D6" },
  situation: { main: 0x73C5EA, glow: 0x9ADCF7, text: "#73C5EA" },
  emotion: { main: 0x8DD8E8, glow: 0x9ADCF7, text: "#8DD8E8" },
  decision: { main: 0x2F759B, glow: 0x73C5EA, text: "#9ADCF7" },
  outcome: { main: 0xD9A8A0, glow: 0xF2F7F9, text: "#D9A8A0" },
};

export default function Constellation3DCanvas({
  nodes = [],
  links = [],
  selectedNode = null,
  hoveredNode = null,
  onSelectNode = () => {},
  onHoverNode = () => {},
  activeFilter = "all",
  searchQuery = "",
  resetTrigger = 0,
}) {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const nodeMeshesRef = useRef(new Map());
  const lineMeshesRef = useRef([]);
  const animFrameRef = useRef(null);

  const isDraggingRef = useRef(false);
  const draggedNodeRef = useRef(null);
  const isOrbitingRef = useRef(false);
  const previousMouseRef = useRef({ x: 0, y: 0 });
  const cameraTargetRef = useRef(new THREE.Vector3(0, 0, 0));
  const cameraDefaultPos = new THREE.Vector3(0, 0, 85);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x07141d, 0.007);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    camera.position.copy(cameraDefaultPos);
    camera.lookAt(cameraTargetRef.current);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x07141d, 1);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const ambientLight = new THREE.AmbientLight(0x2f759b, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x9adcf7, 1.5);
    dirLight.position.set(40, 60, 50);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0x73c5ea, 2, 120);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    const starCount = 500;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i += 3) {
      starPos[i] = (Math.random() - 0.5) * 260;
      starPos[i + 1] = (Math.random() - 0.5) * 260;
      starPos[i + 2] = (Math.random() - 0.5) * 260;
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0x8dd8e8,
      size: 0.8,
      transparent: true,
      opacity: 0.5,
    });
    const starPoints = new THREE.Points(starGeo, starMat);
    scene.add(starPoints);

    const nodePositions = new Map();
    const nodeMeshMap = new Map();

    const rootNode = nodes.find((n) => n.type === "root") || { id: "user" };
    nodePositions.set(rootNode.id, new THREE.Vector3(0, 0, 0));

    const themes = nodes.filter((n) => n.type === "theme");
    const situations = nodes.filter((n) => n.type === "situation");
    const emotions = nodes.filter((n) => n.type === "emotion");
    const decisions = nodes.filter((n) => n.type === "decision");
    const outcomes = nodes.filter((n) => n.type === "outcome");

    themes.forEach((t, i) => {
      const angle = (i / Math.max(themes.length, 1)) * Math.PI * 2;
      const radius = 22;
      const z = Math.sin(i * 2.5) * 12;
      nodePositions.set(t.id, new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, z));
    });

    situations.forEach((s, i) => {
      const parentPos = s.category && themes.find((t) => t.label === s.category)
        ? nodePositions.get(themes.find((t) => t.label === s.category).id)
        : new THREE.Vector3(0, 0, 0);

      const angle = (i / Math.max(situations.length, 1)) * Math.PI * 2 + 0.4;
      const radius = 18 + (i % 3) * 6;
      const z = (parentPos ? parentPos.z : 0) + Math.cos(i * 1.8) * 16;
      nodePositions.set(
        s.id,
        new THREE.Vector3(
          (parentPos ? parentPos.x : 0) + Math.cos(angle) * radius,
          (parentPos ? parentPos.y : 0) + Math.sin(angle) * radius,
          z
        )
      );
    });

    [...emotions, ...decisions, ...outcomes].forEach((n, i) => {
      const angle = (i / 8) * Math.PI * 2;
      const radius = 14 + (i % 4) * 4;
      const z = Math.sin(i * 3) * 20;
      nodePositions.set(
        n.id,
        new THREE.Vector3(
          Math.cos(angle) * radius + (Math.random() - 0.5) * 10,
          Math.sin(angle) * radius + (Math.random() - 0.5) * 10,
          z
        )
      );
    });

    nodes.forEach((nodeData) => {
      const pos = nodePositions.get(nodeData.id) || new THREE.Vector3(0, 0, 0);
      const palette = COLOR_PALETTE[nodeData.type] || COLOR_PALETTE.situation;

      let geometry;

      if (nodeData.type === "root") {
        geometry = new THREE.IcosahedronGeometry(4.2, 3);
      } else if (nodeData.type === "theme") {
        geometry = new THREE.OctahedronGeometry(3.2, 0);
      } else if (nodeData.type === "situation") {
        geometry = new THREE.IcosahedronGeometry(2.6, 2);
      } else if (nodeData.type === "decision") {
        geometry = new THREE.TetrahedronGeometry(2.6, 0);
      } else if (nodeData.type === "outcome") {
        geometry = new THREE.SphereGeometry(2.2, 16, 16);
      } else {
        geometry = new THREE.SphereGeometry(2.0, 16, 16);
      }

      const material = new THREE.MeshPhongMaterial({
        color: palette.main,
        emissive: palette.main,
        emissiveIntensity: 0.35,
        shininess: 80,
        transparent: true,
        opacity: 0.95,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.copy(pos);
      mesh.userData = { ...nodeData, originalPos: pos.clone() };

      if (nodeData.type === "root") {
        const haloGeo = new THREE.IcosahedronGeometry(5.4, 2);
        const haloMat = new THREE.MeshBasicMaterial({
          color: 0x73c5ea,
          transparent: true,
          opacity: 0.22,
          wireframe: true,
        });
        const haloMesh = new THREE.Mesh(haloGeo, haloMat);
        mesh.add(haloMesh);
      }

      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 64;
      const ctx = canvas.getContext("2d");
      ctx.font = "Bold 24px sans-serif";
      ctx.fillStyle = palette.text;
      ctx.textAlign = "center";
      ctx.shadowColor = "rgba(7, 20, 29, 0.8)";
      ctx.shadowBlur = 6;
      ctx.fillText(nodeData.label, 128, 40);

      const texture = new THREE.CanvasTexture(canvas);
      const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.position.set(0, -4.5, 0);
      sprite.scale.set(16, 4, 1);
      mesh.add(sprite);

      scene.add(mesh);
      nodeMeshMap.set(nodeData.id, mesh);
    });

    nodeMeshesRef.current = nodeMeshMap;

    const lineMeshes = [];
    links.forEach((link) => {
      const sourceMesh = nodeMeshMap.get(link.source);
      const targetMesh = nodeMeshMap.get(link.target);

      if (sourceMesh && targetMesh) {
        const lineGeo = new THREE.BufferGeometry().setFromPoints([
          sourceMesh.position,
          targetMesh.position,
        ]);
        const lineMat = new THREE.LineBasicMaterial({
          color: 0x73c5ea,
          transparent: true,
          opacity: 0.45,
          linewidth: 1.5,
        });
        const line = new THREE.Line(lineGeo, lineMat);
        line.userData = { sourceId: link.source, targetId: link.target };
        scene.add(line);
        lineMeshes.push(line);
      }
    });
    lineMeshesRef.current = lineMeshes;

    let clock = new THREE.Clock();

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      starPoints.rotation.y = elapsedTime * 0.02;

      nodeMeshMap.forEach((mesh, id) => {
        if (!isDraggingRef.current || draggedNodeRef.current?.userData.id !== id) {
          const orig = mesh.userData.originalPos;
          const offset = Math.sin(elapsedTime * 1.5 + mesh.id) * 0.4;
          mesh.position.y = orig.y + offset;
        }
      });

      lineMeshes.forEach((line) => {
        const srcMesh = nodeMeshMap.get(line.userData.sourceId);
        const tgtMesh = nodeMeshMap.get(line.userData.targetId);
        if (srcMesh && tgtMesh) {
          const positions = line.geometry.attributes.position.array;
          positions[0] = srcMesh.position.x;
          positions[1] = srcMesh.position.y;
          positions[2] = srcMesh.position.z;
          positions[3] = tgtMesh.position.x;
          positions[4] = tgtMesh.position.y;
          positions[5] = tgtMesh.position.z;
          line.geometry.attributes.position.needsUpdate = true;
        }
      });

      camera.lookAt(cameraTargetRef.current);
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (rendererRef.current && rendererRef.current.domElement) {
        rendererRef.current.domElement.remove();
      }
      scene.clear();
    };
  }, [nodes, links]);

  useEffect(() => {
    if (!nodeMeshesRef.current || nodeMeshesRef.current.size === 0) return;

    const nodeMeshMap = nodeMeshesRef.current;
    const lineMeshes = lineMeshesRef.current;

    const directConnectedIds = new Set();
    if (selectedNode) {
      directConnectedIds.add(selectedNode.id);
      links.forEach((l) => {
        if (l.source === selectedNode.id) directConnectedIds.add(l.target);
        if (l.target === selectedNode.id) directConnectedIds.add(l.source);
      });
    }

    nodeMeshMap.forEach((mesh, id) => {
      const nodeData = mesh.userData;
      let opacity = 1.0;
      let scale = 1.0;

      if (activeFilter !== "all" && nodeData.type !== activeFilter && nodeData.type !== "root") {
        opacity = 0.15;
        scale = 0.6;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match = nodeData.label.toLowerCase().includes(q) || (nodeData.category && nodeData.category.toLowerCase().includes(q));
        if (!match) opacity = 0.2;
      }

      if (selectedNode) {
        if (directConnectedIds.has(id)) {
          opacity = Math.min(opacity, 1.0);
          scale = id === selectedNode.id ? 1.25 : 1.1;
        } else {
          opacity = Math.min(opacity, 0.25);
        }
      }

      mesh.material.opacity = opacity;
      mesh.scale.set(scale, scale, scale);
    });

    lineMeshes.forEach((line) => {
      const srcId = line.userData.sourceId;
      const tgtId = line.userData.targetId;

      if (selectedNode) {
        if (srcId === selectedNode.id || tgtId === selectedNode.id) {
          line.material.opacity = 0.9;
          line.material.color.setHex(0x9adcf7);
        } else {
          line.material.opacity = 0.12;
          line.material.color.setHex(0x73c5ea);
        }
      } else {
        line.material.opacity = 0.45;
        line.material.color.setHex(0x73c5ea);
      }
    });

    if (selectedNode && cameraRef.current) {
      const selMesh = nodeMeshMap.get(selectedNode.id);
      if (selMesh) {
        const targetPos = selMesh.position.clone();
        cameraTargetRef.current.lerp(targetPos, 0.1);

        const newCamPos = targetPos.clone().add(new THREE.Vector3(0, 0, 45));
        cameraRef.current.position.lerp(newCamPos, 0.08);
      }
    }
  }, [selectedNode, activeFilter, searchQuery, links]);

  useEffect(() => {
    if (resetTrigger > 0 && cameraRef.current) {
      cameraTargetRef.current.set(0, 0, 0);
      cameraRef.current.position.copy(cameraDefaultPos);
    }
  }, [resetTrigger]);

  const getPointerPos = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: ((clientX - rect.left) / rect.width) * 2 - 1,
      y: -((clientY - rect.top) / rect.height) * 2 + 1,
      rawX: clientX,
      rawY: clientY,
    };
  };

  const handlePointerDown = (e) => {
    if (!sceneRef.current || !cameraRef.current) return;
    const ptr = getPointerPos(e);
    previousMouseRef.current = { x: ptr.rawX, y: ptr.rawY };

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(ptr.x, ptr.y), cameraRef.current);
    const meshes = Array.from(nodeMeshesRef.current.values());
    const intersects = raycaster.intersectObjects(meshes);

    if (intersects.length > 0) {
      isDraggingRef.current = true;
      draggedNodeRef.current = intersects[0].object;
    } else {
      isOrbitingRef.current = true;
    }
  };

  const handlePointerMove = (e) => {
    if (!sceneRef.current || !cameraRef.current) return;
    const ptr = getPointerPos(e);

    if (isDraggingRef.current && draggedNodeRef.current) {
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(ptr.x, ptr.y), cameraRef.current);
      const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -draggedNodeRef.current.position.z);
      const targetPoint = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, targetPoint);

      if (targetPoint) {
        draggedNodeRef.current.position.copy(targetPoint);
        draggedNodeRef.current.userData.originalPos.copy(targetPoint);
      }
      return;
    }

    if (isOrbitingRef.current && cameraRef.current) {
      const deltaX = ptr.rawX - previousMouseRef.current.x;
      const deltaY = ptr.rawY - previousMouseRef.current.y;
      previousMouseRef.current = { x: ptr.rawX, y: ptr.rawY };

      const cam = cameraRef.current;
      const rotSpeed = 0.005;

      const radius = cam.position.distanceTo(cameraTargetRef.current);
      let theta = Math.atan2(cam.position.x, cam.position.z);
      let phi = Math.acos(Math.min(Math.max(cam.position.y / radius, -1), 1));

      theta -= deltaX * rotSpeed;
      phi -= deltaY * rotSpeed;
      phi = Math.max(0.1, Math.min(Math.PI - 0.1, phi));

      cam.position.x = radius * Math.sin(phi) * Math.sin(theta);
      cam.position.y = radius * Math.cos(phi);
      cam.position.z = radius * Math.sin(phi) * Math.cos(theta);
      return;
    }

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(ptr.x, ptr.y), cameraRef.current);
    const meshes = Array.from(nodeMeshesRef.current.values());
    const intersects = raycaster.intersectObjects(meshes);

    if (intersects.length > 0) {
      const hitNode = intersects[0].object.userData;
      onHoverNode(hitNode);
    } else {
      onHoverNode(null);
    }
  };

  const handlePointerUp = (e) => {
    if (isDraggingRef.current && draggedNodeRef.current) {
      onSelectNode(draggedNodeRef.current.userData);
    } else if (isOrbitingRef.current) {
      const ptr = getPointerPos(e);
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(ptr.x, ptr.y), cameraRef.current);
      const meshes = Array.from(nodeMeshesRef.current.values());
      const intersects = raycaster.intersectObjects(meshes);

      if (intersects.length > 0) {
        onSelectNode(intersects[0].object.userData);
      }
    }

    isDraggingRef.current = false;
    draggedNodeRef.current = null;
    isOrbitingRef.current = false;
  };

  const handleWheel = (e) => {
    if (!cameraRef.current) return;
    e.preventDefault();
    const cam = cameraRef.current;
    const zoomFactor = e.deltaY * 0.08;
    const dist = cam.position.distanceTo(cameraTargetRef.current);
    const newDist = Math.max(25, Math.min(180, dist + zoomFactor));

    cam.position.sub(cameraTargetRef.current).normalize().multiplyScalar(newDist).add(cameraTargetRef.current);
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handlePointerDown}
      onMouseMove={handlePointerMove}
      onMouseUp={handlePointerUp}
      onTouchStart={handlePointerDown}
      onTouchMove={handlePointerMove}
      onTouchEnd={handlePointerUp}
      onWheel={handleWheel}
      className="w-full h-full min-h-[520px] lg:min-h-[680px] rounded-3xl overflow-hidden cursor-grab active:cursor-grabbing relative select-none shadow-2xl border border-[#2F759B]/40"
    />
  );
}
