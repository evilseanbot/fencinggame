function FixedUpdate () {
    var zVel = 0f;
    var walkingSpeed = 0.25f;

    if(Input.GetKey("w")) {
        zVel = walkingSpeed;
    } else if (Input.GetKey("s")) {
        zVel = -walkingSpeed;
    } else {
        zVel = 0;
    }
    
    if (Input.GetKey("r")) {
        Application.LoadLevel("demo");
    }
    
    transform.position.z += zVel;
}

function OnCollisionStay (collision: Collision) {
    if (collision.gameObject.name == "EnemySword") {
        var bloodSpout = GameObject.Find("PlayerBloodSpout");
        var EnemySword = GameObject.Find("EnemySword");
        bloodSpout.transform.position = EnemySword.transform.Find("Tip").position;
        bloodSpout.transform.rotation = EnemySword.transform.Find("Tip").rotation;
        bloodSpout.transform.rotation.z += 180;
        bloodSpout.particleSystem.Play();
        rigidbody.isKinematic = false;
        rigidbody.useGravity = true;
        var sword = GameObject.Find("Sword");
        //sword.GetComponent("SwordController").alive = false;
        sword.rigidbody.useGravity = true;
        sword.rigidbody.drag = 0;
        sword.rigidbody.angularDrag = 0.5;
    }
}