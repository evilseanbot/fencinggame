var bloodSpoutObject : GameObject;

function OnCollisionStay (collision: Collision) {
    if (collision.gameObject.name == "EnemySword") {
        if (madeImpact(collision)) {
            die();
	     }
	}
}

function die() {
	var EnemySword = GameObject.Find("EnemySword");
	var player = GameObject.Find("Player");
	var upperBody = player.transform.FindChild("UpperBody");
//	var bloodSpout = upperBody.FindChild("PlayerBloodSpout").gameObject;

    var bloodSpout = GameObject.Instantiate(bloodSpoutObject, transform.position, transform.rotation);


	bloodSpout.transform.position = EnemySword.transform.Find("Tip").position;
	bloodSpout.transform.rotation = EnemySword.transform.Find("Tip").rotation;
	bloodSpout.transform.rotation.z += 180;
	bloodSpout.particleSystem.Play();

	player.rigidbody.isKinematic = false;
	player.rigidbody.useGravity = true;
    player.rigidbody.constraints = RigidbodyConstraints.None;
    player.rigidbody.drag = 1;

	GameObject.Destroy(GameObject.Find("LevelText"));	        	        
	GameObject.Find("ResetText").guiText.text = 'Press "R" to retry';
	player.GetComponent("PlayerController").wounded = true;
}

function madeImpact(collision) {
    var enemySword = collision.gameObject;
    var enemy = enemySword.transform.parent.parent.gameObject;    
        
    if (enemy.GetComponent("EnemyTargetController").alive) {
        return true;
    } else {
       return false;
    }
    
}