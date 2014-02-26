function OnCollisionStay (collision: Collision) {
    if (collision.gameObject.name == "Sword") {
        var bloodSpout = transform.Find("BloodSpout").gameObject;
        var EnemySword = GameObject.Find("Sword");
        bloodSpout.transform.position = EnemySword.transform.Find("Tip").position;
        bloodSpout.transform.rotation = EnemySword.transform.Find("Tip").rotation;
        bloodSpout.transform.rotation.z += 180;
        bloodSpout.particleSystem.Play();    
    

        rigidbody.isKinematic = false;
        var enemySword = GameObject.Find("EnemySword");
        enemySword.GetComponent("EnemySwordController").alive = false;
        enemySword.rigidbody.useGravity = true;
        enemySword.rigidbody.drag = 0;
        enemySword.rigidbody.angularDrag = 0.5;
    }
}