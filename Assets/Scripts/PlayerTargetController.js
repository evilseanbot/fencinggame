var bloodSpoutObject : GameObject;

function OnTriggerEnter(thing) {
    if (thing.tag == "deadly") {
        //die(thing);
    }
}

function OnCollisionStay (collision: Collision) {
    if (collision.gameObject.tag == "deadly") {
        if (madeImpact(collision)) {
            //die(collision.gameObject);
	     }
	}
}

function die(collider) {
    var EnemySword;
    
    if (collider.name == "SpearPoint") {
        EnemySword = collider.transform.parent.gameObject;
    } else {
        EnemySword = collider;
    }

	var player = GameObject.Find("Player");
	var upperBody = player.transform.FindChild("UpperBody");

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
	GameObject.Find("ResetText").GetComponent("TextMesh").text = 'Press "R" to retry';
	player.GetComponent("PlayerController").wounded = true;
}

function madeImpact(collision) {
    var enemySword;

    if (collision.gameObject.name == "SpearPoint") {
        enemySword = collision.gameObject.transform.parent.gameObject;
    } else {
        enemySword = collision.gameObject;
    }
    
    var enemy = enemySword.transform.parent.parent.gameObject;    
        
    if (enemy.GetComponent("EnemyTargetController").alive) {
        return true;
    } else {
       return false;
    }
}