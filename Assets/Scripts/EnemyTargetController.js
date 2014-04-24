var walkingForward: boolean = false;
var walkingBackward: boolean = false;
var timeTillNextWalkDecision: float = 1f;
var timeTakenWalking: float = 0f;
private var walkDecisionTime = 1f;
private var walkingSpeed = 1.4f;
private var chasingSpeed = 2.8f;
var alive = true;
var bloodSpoutObject : GameObject;
var closestOpponentZone: int = 4;
private var opponent: GameObject;
var swordDrawSound: AudioClip;
var swordDrawSoundTime: float = 0;
var swordSheathSound: AudioClip;
var swordSheathSoundTime: float = 0;
var weapon = "Sword";


function Start() {
    opponent = GameObject.Find("Player");
}

function FixedUpdate() {
    if (alive) {
	    var newZone = getClosestOpponentZone();
	    
	    if (closestOpponentZone == 3 && newZone < 3) {
	        if (Time.time > swordDrawSoundTime) {
	            AudioSource.PlayClipAtPoint(swordDrawSound, transform.position);
	            swordDrawSoundTime = Time.time + swordDrawSound.length;
	        }
	    }
	    
	    if (closestOpponentZone == 2 && newZone > 2) {
	        if (Time.time > swordSheathSoundTime) {
	            AudioSource.PlayClipAtPoint(swordSheathSound, transform.position, 0.25f);
	            swordSheathSoundTime = Time.time + swordSheathSound.length;
	        }
	    }
	    

	    closestOpponentZone = newZone;
	    
	    if (closestOpponentZone == 3) {
	        chase();
	    }

	    if (closestOpponentZone == 1 || closestOpponentZone == 2) {
	        walk();
		}
	}
}

function getClosestOpponentZone() {
    // Doesn't support multiple allies, fiddle with code later for that.

	var shortestDist = null;
	var distance = 0;

    if (opponent.GetComponent("PlayerController").wounded) {
        return 4;
    }
    
	distance = Vector3.Distance(transform.position, opponent.transform.position);    
	
    if (shortestDist == null || shortestDist > distance) {
        shortestDist = distance;
    }
    
    if (weapon == "Sword") {
	    if (shortestDist > 24) {
	        return 4;
	    } else if (shortestDist > 6) {
	        return 3;
	    } else if (shortestDist > 3) {
	        return 2;
	    } else {
	        return 1;
	    }    
	} else if (weapon == "Pike") {
	    if (shortestDist > 24) {
	        return 4;
	    } else if (shortestDist > 9) {
	        return 3;
	    } else if (shortestDist > 6) {
	        return 2;
	    } else {
	        return 1;
	    }    
	
	}
}


function chase() {
    var zVel = chasingSpeed;
    
	var targetDir = opponent.transform.position - transform.position;
	var lookDir = Vector3.RotateTowards(transform.forward, targetDir, 1f, 0.0f);
	var lookRot = Quaternion.LookRotation(lookDir);
	transform.rotation = Quaternion.Euler(transform.rotation.eulerAngles.x, lookRot.eulerAngles.y, transform.rotation.eulerAngles.z);

    var moveDirection = new Vector3(0, 0, zVel * Time.deltaTime);
    moveDirection = transform.TransformDirection(moveDirection);
    var newPosition = transform.position + moveDirection;
    rigidbody.MovePosition(newPosition);    
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
		    timeTillNextWalkDecision = walkDecisionTime;
		} else if (random > 2) {
		    walkingBackward = true;
		    timeTillNextWalkDecision = walkDecisionTime / 2f;		    
		} 
		
		if (walkingBackward && closestOpponentZone == 2) {
		    walkingForward = true;
		    walkingBackward = false;
		    timeTillNextWalkDecision = walkDecisionTime;		    
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

