private var zVel = 0f;
private var xVel = 0f;
private var lockonDist = 10f;
var wounded = false;
private var debugMode = false;
private var walkingSpeed = 1.4f;
private var rotSpeed = 30f;

function Start() {
    if (debugMode) {
        walkingSpeed = 14f;
        rotSpeed = 300f;
    }
}

function FixedUpdate () {
    var swordUp = GameObject.Find("Sword").GetComponent("SwordController").swordUp;

    if (swordUp) {
        walkingSpeed = 1.4f;
    } else {
        walkingSpeed = 2.8f;
    }

    if (debugMode) {
        walkingSpeed = 14f;
        rotSpeed = 300f;
    }


    zVel = 0f;
    xVel = 0f;

    var enemy = closestEnemy();
            
    if (lunging()) {
        walkingSpeed = 0.35f;
    }
    
    if (!wounded) {
	    if(Input.GetKey("w")) {
	        zVel = walkingSpeed;
	    } else if (Input.GetKey("s")) {
	        zVel = -walkingSpeed;
	    }

	    if(Input.GetKey("d")) {
	        if (enemy == null || !swordUp) {
	            transform.Rotate(Vector3.up * (rotSpeed * Time.deltaTime));
	        } else {
	            xVel = walkingSpeed;
	        }
	    } else if (Input.GetKey("a")) {
	        if (enemy == null || !swordUp) {
	            transform.Rotate(-Vector3.up * (rotSpeed * Time.deltaTime));
	        } else {
	            xVel = -walkingSpeed;
	        }
	    }
	    
		if (Input.GetKey("q")) {
	        startLunging();    
	    } else {
	        startUnLunging();
	    }

	}    
    
    // Motion lunging controls.
    /*    
    sword = GameObject.Find("Sword");
   
    if (sword.transform.localPosition.z > 7) {
        startLunging();
    } else {
        startUnLunging();
    }
    */
    
    if (Input.GetKey("r")) {
        restartGame();
    }
        
    var moveDirection = new Vector3(xVel * Time.deltaTime, 0, zVel * Time.deltaTime);
    moveDirection = transform.TransformDirection(moveDirection);
    var newPosition = transform.position + moveDirection;
    rigidbody.MovePosition(newPosition);
    //transform.position += moveDirection;
    
    
    if (enemy != null && swordUp) {
        turnTowards(enemy);
    }
    
}

function turnTowards(enemy) {
	var enemyTrans = enemy.transform;
	var targetDir = enemyTrans.position - transform.position;
	var step = 1f * Time.deltaTime;
	var lookDir = Vector3.RotateTowards(transform.forward, targetDir, step, 0.0f);
	var lookRot = Quaternion.LookRotation(lookDir);
	transform.rotation = Quaternion.Euler(transform.rotation.eulerAngles.x, lookRot.eulerAngles.y, transform.rotation.eulerAngles.z);
	//transform.rotation = Quaternion.LookRotation(lookDir);
}

function closestEnemy() {
	var shortestDist = null;
	var closestEnemy = null;
	var distance = 0;

    var enemies = GameObject.FindGameObjectsWithTag("enemy");
    if (enemies == null) {
        return null;
    } else {

        for (i in enemies) {
            if (i.GetComponent("EnemyTargetController").alive) {
	            distance = Vector3.Distance(transform.position, i.transform.position);    
	            if (shortestDist == null || shortestDist > distance) {
	                shortestDist = distance;
	                closestEnemy = i;
	            }
	        }
        }        
    }
    
    // Don't return any enemy if distance from any enemy is greater than lockon Distance.
    if (shortestDist != null) {
        if (shortestDist > lockonDist) {
            return null;
        }
    }
    return closestEnemy;
}

function startLunging() {
    var animator = transform.FindChild("UpperBody").gameObject.GetComponent("Animator");
    animator.SetBool("lunging", true);
    animator.SetBool("recovering", false);    
}

function startUnLunging() {
    var animator = transform.FindChild("UpperBody").gameObject.GetComponent("Animator");
    animator.SetBool("recovering", true);
    animator.SetBool("lunging", false);
}

function lunging() {
    var animator = transform.FindChild("UpperBody").gameObject.GetComponent("Animator");
    return animator.GetBool("lunging");
}

function restartGame() {
    var memory = GameObject.Find("PersistentMemory").GetComponent("PersistentMemoryController");   
    memory.enemyReflexes = 1;
    Application.LoadLevel("demo");
}