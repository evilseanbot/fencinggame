function OnCollisionStay (collision: Collision) {
    if (collision.gameObject.name == "EnemySword") {
        var EnemySword = GameObject.Find("EnemySword");
        var player = GameObject.Find("Player");
        var upperBody = player.transform.FindChild("UpperBody");
        var bloodSpout = upperBody.FindChild("PlayerBloodSpout").gameObject;
        
        //var bloodSpout = GameObject.Find("Player").transform.FindChild("UpperBody").FindChild("PlayerBloodSpout").gameObject;
        bloodSpout.transform.position = EnemySword.transform.Find("Tip").position;
        bloodSpout.transform.rotation = EnemySword.transform.Find("Tip").rotation;
        bloodSpout.transform.rotation.z += 180;
        bloodSpout.particleSystem.Play();
        
        player.rigidbody.isKinematic = false;
        player.rigidbody.useGravity = true;
        
        var sword = GameObject.Find("Sword");
        //sword.GetComponent("SwordController").alive = false;
        //sword.rigidbody.useGravity = true;
        //sword.rigidbody.drag = 0;
        //sword.rigidbody.angularDrag = 0.5;
        
        GameObject.Find("ResetText").guiText.text = 'Press "R" to retry';
        player.GetComponent("PlayerController").wounded = true;
    }
}