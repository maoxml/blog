(function () {
  function initThreeGlbViewer(parentEl, url) {
    const renderer = new THREE.WebGLRenderer({ antialias: true , preserveDrawingBuffer: true});
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.setSize(parentEl.clientWidth, parentEl.clientHeight);
    parentEl.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xFFFFFF);

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const camera = new THREE.PerspectiveCamera(
      75,
      parentEl.clientWidth / parentEl.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 2;

    const controls = new THREE.OrbitControls(camera, renderer.domElement);

    const loader = new THREE.GLTFLoader();
    loader.load(
      url,
      (gltf) => {
        // 获取模型对象
        const model = gltf.scene.children[0];

        // 修改模型的材质属性，使其使用真实材质
        model.traverse((child) => {
          if (child.isMesh) {
            child.material.side = THREE.DoubleSide;
            child.material.metalness = 0.2;
            child.material.roughness = 0.8;
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        scene.add(gltf.scene);

        // 添加点光源
        const pointLight = new THREE.PointLight(0xffffff, 1, 100);
        pointLight.position.set(0, 5, 5);
        pointLight.castShadow = true;
        pointLight.shadow.mapSize.width = 1024;
        pointLight.shadow.mapSize.height = 1024;
        scene.add(pointLight);

        // 添加环境光
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
        scene.add(ambientLight);

        // 添加镜面反射地面
        const planeGeometry = new THREE.PlaneGeometry(10, 10);
        const planeMaterial = new THREE.MeshBasicMaterial({
          color: 0x000000,
          envMap: renderer.outputEncoding,
        });
        const plane = new THREE.Reflector(planeGeometry, {
          clipBias: 0.003,
          textureWidth: parentEl.clientWidth * window.devicePixelRatio,
          textureHeight: parentEl.clientHeight * window.devicePixelRatio,
          color: 0x888888,
        });
        plane.position.y = -2;
        plane.rotation.x = -Math.PI / 2;
        scene.add(plane);

        // 添加投影
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        model.castShadow = true;
        model.receiveShadow = true;
        pointLight.castShadow = true;
      },
      undefined,
      (error) => {
        console.error("An error occurred while loading the GLB model:", error);
      }
    );

    const hemiLight = new THREE.HemisphereLight(0x443333, 0x111122);
    scene.add(hemiLight);

    const spotLight = new THREE.SpotLight();
    spotLight.angle = Math.PI / 16;
    spotLight.penumbra = 0.5;
    spotLight.castShadow = true;
    spotLight.position.set(-1, 1, 1);
    scene.add(spotLight);

    // 添加hdr环境
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    new THREE.TextureLoader().load(
      'models/royal_esplanade_1k.hdr',
      function (texture) {
        const envMap = pmremGenerator.fromEquirectangular(texture).texture;
        scene.background = envMap;
        scene.environment = envMap;
        texture.dispose();
        pmremGenerator.dispose();
      }
    );

    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }
    animate();
  }

  function parseGlbCodeBlocks() {
    const codeBlocks = document.querySelectorAll('pre[data-lang="3D"]');

    if (!codeBlocks) return;

    codeBlocks.forEach((codeBlock) => {
      const modelUrl = codeBlock.textContent.trim();
      const glbContainer = document.createElement("div");
      glbContainer.style.width = "100%";
      glbContainer.style.height = "400px";
      codeBlock.parentNode.replaceChild(glbContainer, codeBlock);

      initThreeGlbViewer(glbContainer, modelUrl);
    });
  }

  if (window.$docsify) {
    window.$docsify.plugins = [].concat(function (hook) {
      hook.doneEach(parseGlbCodeBlocks);
    });
  } else {
    window.addEventListener("load", parseGlbCodeBlocks);
  }

})();
