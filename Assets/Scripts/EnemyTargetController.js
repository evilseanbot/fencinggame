var walkingForward: boolean = false;
var walkingBackward: boolean = false;
var timeTillNextWalkDecision: float = 1f;
var timeTakenWalking: float = 0f;
private var walkingSpeed = 0.7f;
var alive = true;
var bloodSpoutObject : GameObject;

function FixedUpdate() {
    if (alive) {
        walk();
    }        
}

function walk() {
    var zVel = 0f;

    makeWalkingDecision();
    
    zVel = getZVelByWalkingState();
       
    var moveDirection = new Vector3(0, 0, zVel * Time.deltaTime);
    moveDirection = transform.TransformDirection(moveDirection);
    var newPosition = transform.position + moveDirection;
    rigidbody.MovePosition(newPosition);
    //transform.position = transform.position + (moveDirection);
}

function makeWalkingDecision() {
    timeTakenWalking += Time.deltaTime;
    if (timeTakenWalking >= timeTillNextWalkDecision) {

		timeTakenWalking = 0;

		var random: float = Random.Range(0f, 4f);

		walkingForward = false;
		walkingBackward = false;

		if (random > 3) {
		    walkingForward = true;
		} else if (random > 2) {
		    walkingBackward = true;
		} 
	}
}

function getZVelByWalkingState() {
    var zVel;

    if (walkingForward) {
        zVel = walkingSpeed;
    } else if (walkingBackward) {
        zVel = -walkingSpeed;
    } else {
        zVel = 0f;
    }
    
    return zVel;
 
}

function OnCollisionStay (collision: Collision) {

    if (collision.gameObject.name == "Sword") {
        if (collision.gameObject.GetComponent("SwordController").swordUp) {
            if (alive) {
                audio.Play();
            }
        
	        alive = false;        
	        var bloodSpout = GameObject.Instantiate(bloodSpoutObject, transform.position, transform.rotation);
	        
	        // Doesn't support multiple allies yet.
	        var EnemySword = GameObject.Find("Sword");
	        bloodSpout.transform.position = EnemySword.transform.Find("Tip").position;
	        bloodSpout.transform.rotation = EnemySword.transform.Find("Tip").rotation;
	        bloodSpout.transform.rotation.z += 180;
	        bloodSpout.particleSystem.Play();    
	        
	        rigidbody.constraints = RigidbodyConstraints.None;
	        rigidbody.drag = 1;
	    

	        rigidbody.isKinematic = false;
	        var enemySword = transform.Find("EnemyUpperBody").Find("EnemySword").gameObject;
	        enemySword.GetComponent("EnemySwordController").alive = false;
	        enemySword.rigidbody.constraints = RigidbodyConstraints.None;
	        enemySword.rigidbody.useGravity = true;
	        enemySword.rigidbody.drag = 0;
	        enemySword.rigidbody.angularDrag = 0.5;
	        
	        //Invoke("advanceLevel", 5f);        
	    }
    }
}

function advanceLevel() {

    // !! Doesn't currently support multple players.

    var playerController = GameObject.Find("Player").GetComponent("PlayerController");
    if (!playerController.wounded) {
	    var memory = GameObject.Find("PersistentMemory").GetComponent("PersistentMemoryController");   
	    memory.enemyReflexes += 1;
	    Application.LoadLevel("demo");
	}
}

