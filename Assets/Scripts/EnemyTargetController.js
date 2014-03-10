var walkingForward: boolean = false;
var walkingBackward: boolean = false;
var timeTillNextWalkDecision: float = 1f;
var timeTakenWalking: float = 0f;
var zVel = 0.08f;
var alive = true;

function FixedUpdate() {
    if (alive) {
        walk();
    }
}

function walk() {
    timeTakenWalking += Time.deltaTime;
    
    if (timeTakenWalking >= timeTillNextWalkDecision) {
        timeTakenWalking = 0;
        
        var random: float = Random.Range(0f, 3f);
        Debug.Log(random);
        
        walkingForward = false;
        walkingBackward = false;
        
        if (random > 2) {
            walkingForward = true;
        } else if (random > 1) {
            walkingBackward = true;
        } 
    }
    
    if (walkingForward) {
        transform.position.z -= zVel;
    } else if (walkingBackward) {
        transform.position.z += zVel;
    }

}

function OnCollisionStay (collision: Collision) {
    if (collision.gameObject.name == "Sword") {
        alive = false;
        var bloodSpout = transform.Find("EnemyUpperBody").Find("BloodSpout").gameObject;
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
        
        Invoke("advanceLevel", 5f);        
    }
}

function advanceLevel() {
    var playerController = GameObject.Find("Player").GetComponent("PlayerController");
    if (!playerController.wounded) {
	    var memory = GameObject.Find("PersistentMemory").GetComponent("PersistentMemoryController");   
	    memory.enemyReflexes += 1;
	    Application.LoadLevel("demo");
	}
}

