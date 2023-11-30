import {
  Engine,
  HemisphericLight,
  Scene,
  UniversalCamera,
  Vector3,
  MeshBuilder,
  Vector4,
  CannonJSPlugin,
  StandardMaterial,
  PhysicsImpostor,
  Color3,
} from "@babylonjs/core";
import * as Cannon from "cannon";

class App {
  constructor() {
    window.CANNON = Cannon;
    const canvas = document.createElement("canvas");
    canvas.style.width = "100vw";
    canvas.style.height = "100vh";
    canvas.id = "app-canvas";
    document.body.style.margin = "0px";
    document.body.append(canvas);

    const engine = new Engine(canvas, true);
    const scene = new Scene(engine);
    scene.enablePhysics(null, new CannonJSPlugin());

    const camera = new UniversalCamera("camera", new Vector3(0, 9, -15));
    camera.setTarget(Vector3.Zero());
    const light = new HemisphericLight("light", new Vector3(1, 1, 0), scene);
    light.intensity = 0.7;

    window.addEventListener("keydown", (e) => {
      if (e.shiftKey && e.ctrlKey && e.altKey && e.key === "j") {
        if (scene.debugLayer.isVisible()) {
          scene.debugLayer.hide();
        } else {
          scene.debugLayer.show();
        }
      }
    });

    const table = MeshBuilder.CreateBox(
      "table",
      {
        width: 10,
        height: 2,
        depth: 8,
        faceUV: [
          new Vector4(0, 0, 0, 0),
          new Vector4(0, 0, 0, 0),
          new Vector4(0, 0, 0, 0),
          new Vector4(0, 0, 0, 0),
          new Vector4(0, 0, 1, 1),
          new Vector4(0, 0, 0, 0),
        ],
        wrap: true,
      },
      scene
    );

    table.physicsImpostor = new PhysicsImpostor(
      table,
      PhysicsImpostor.BoxImpostor,
      { mass: 0, restitution: 0.9, friction: 0.1 }
    );
    table.position.y = 1;

    const ground = MeshBuilder.CreateGround(
      "ground",
      {
        width: 1000,
        height: 1000,
      },
      scene
    );

    ground.physicsImpostor = new PhysicsImpostor(
      ground,
      PhysicsImpostor.BoxImpostor,
      { mass: 0, restitution: 0.9 }
    );
    ground.position.y = 0;

    scene.onPointerDown = (e, pickInfo) => {
      const coin = MeshBuilder.CreateCylinder("coin", {
        height: 0.025,
        diameter: 0.2,
      });
      const coinMaterial = new StandardMaterial("coin-material", scene);
      coinMaterial.diffuseColor = new Color3(255, 215, 0);
      coin.material = coinMaterial;

      let tossFromX = pickInfo.pickedPoint?.x || 0;
      let tossFromZ = pickInfo.pickedPoint?.z || 0;

      coin.position.x = tossFromX;
      coin.position.y = 6;
      coin.position.z = tossFromZ - 10;

      coin.physicsImpostor = new PhysicsImpostor(
        coin,
        PhysicsImpostor.CylinderImpostor,
        { mass: 1, restitution: 0.2, friction: 0.1 }
      );

      coin.physicsImpostor.applyImpulse(
        new Vector3(0, 0, 10),
        coin.absolutePosition
      );
    };

    engine.runRenderLoop(() => {
      scene.render();
    });
  }
}

new App();
