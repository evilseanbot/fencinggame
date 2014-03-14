var timeToReset;
var timeElapsed = 0.0f;
var phase = 0;
var prefab : GameObject;
var onRightSideBefore: boolean = true;
var onRightSideNow : boolean = true;
var switchingSides: boolean = false;
var initiallyWaiting: boolean = false;
var timeToWait: float = 4f;
var alive: boolean = true;
var timeToThrust = 0.5f;
var enemyUpperBody: GameObject;
var targetPos: Vector3;
var targetRot: Quaternion;
var startingPos: Vector3;
var startingRot: Quaternion;

function Start() {
    var memory = GameObject.Find("PersistentMemory").GetComponent("PersistentMemoryController");
    timeToThrust = 1f / memory.enemyReflexes;
    timeToReset = new Array(timeToThrust*0.5f, timeToThrust*0.5f, 0, timeToThrust, timeToThrust*0.5f, 0, timeToThrust/5f, timeToThrust);
    
    enemyUpperBody = GameObject.Find("EnemyUpperBody");
    
}

function advancePhaseClock() {
	timeElapsed += Time.deltaTime;
	if (timeElapsed > timeToReset[phase]) {
	    timeElapsed = 0;
	    phase += 1;
	}
}

function FixedUpdate() {
    if (!alive) {
        return;
    }
    
    if (initiallyWaiting) {
        wait();
    }

    // Phase 0 is waiting.
    if (phase == 0) {
        startingPos = transform.position;
        startingRot = transform.rotation;
        
        chasePos(10f);        
    
        advancePhaseClock();
    }
    
    // Phase 1 is thrusting
    else if (phase == 1) {
        thrust();       
    }
    
    //Phase 2 is setting new starting position.
    else if (phase == 2) {
        startingPos = transform.position;
        startingRot = transform.rotation;
        phase = 3;
    
    }

    // Phase 2 is recovering
    else if (phase == 3) {
        recover();
    }
    
    
    // Phase 3 is moving back to the home position.
    else if (phase == 4) {       
        //moveToHome();    
        phase = 0;
    }
    
    else if (phase == 5) {
        phase = 0;
    }
    /*
    // Phase 4 is choosing a side to switch to.
    else if (phase == 4) {
        chooseSide();
    }
    
    // Phase 5 is switching over to a different side.
    else if (phase == 5) {
        switchSides();
    }
    
    // Phase 6 is setting the appropiate rotation.
    else if (phase == 6) {
        setSideRotation();
    }
    
    // Phase 7 is reseting the phase + switchingSides.
    else if (phase == 7) {
        switchingSides = false;
        phase = 0;
    }
    */ 
}

function thrust() {
	enemyUpperBody.GetComponent("Animator").SetBool("lunging", true);    
	enemyUpperBody.GetComponent("Animator").SetBool("recovering", false);    
	var sixAttackPos: Vector3 = new Vector3 (2, -1, -15);
	var sixAttackRot: Quaternion = Quaternion.Euler ( new Vector3( -10, 190, 0) );
	
	targetPos = Vector3.Lerp(startingPos, sixAttackPos + enemyUpperBody.transform.position, timeElapsed / timeToReset[phase]);
	targetRot = Quaternion.Lerp(startingRot, sixAttackRot, timeElapsed / timeToReset[phase]);	
	chasePos(0.10f);
			
    /*
	if (onRightSideNow) {

	    rigidbody.AddForce(-40f/timeToThrust, -40f/timeToThrust, -80f/timeToThrust);
	} else {
	    rigidbody.AddForce(40f/timeToThrust, -40f/timeToThrust, -80f/timeToThrust);        
	}*/
	advancePhaseClock(); 
}

function wait() {
	timeElapsed += Time.deltaTime;

	if (timeElapsed > timeToWait) {
	    timeElapsed = 0;
	    initiallyWaiting = false;        
	} else {
	    return;
	} 
}

function recover() {
	enemyUpperBody.GetComponent("Animator").SetBool("lunging", false);    
	enemyUpperBody.GetComponent("Animator").SetBool("recovering", true);    
	
	var sixRestPos: Vector3 = new Vector3 (4, -1, -12);
	var sixRestRot: Quaternion = Quaternion.Euler( new Vector3(-30, 210, 0) );
	
	//rigidbody.MovePosition(Vector3.Lerp(transform.position, sixRestPos + enemyUpperBody.transform.position, timeElapsed / timeToReset[phase]));
	//rigidbody.MoveRotation(Quaternion.Lerp(transform.rotation, sixRestRot, timeElapsed / timeToReset[phase]));

	targetPos = Vector3.Lerp(startingPos, sixRestPos + enemyUpperBody.transform.position, timeElapsed / timeToReset[phase]);
	targetRot = Quaternion.Lerp(startingRot, sixRestRot, timeElapsed / timeToReset[phase]);	
	chasePos(10f);
	
			
    /*
	if (onRightSideNow) {
	    rigidbody.AddForce(40f/timeToThrust, 40f/timeToThrust, 80f/timeToThrust);
	} else {
	    rigidbody.AddForce(-40f/timeToThrust, 40f/timeToThrust, 80f/timeToThrust);        
	}
	*/
	    
	advancePhaseClock();        
}

function moveToHome() {
    /*
	var targetPos: Vector3;
	var targetRot: Quaternion;
	var enemyTrans: Transform = GameObject.Find("Enemy").transform;

	if (onRightSideNow) {
	    targetPos = Vector3(4.7f + enemyTrans.position.x, 1.8f + enemyTrans.position.y, -5.9f + enemyTrans.position.z);
	    targetRot = Quaternion.Euler(11, 199, 0);

	    rigidbody.MovePosition(Vector3.Lerp(transform.position, targetPos, 0.10f));
	    rigidbody.MoveRotation(Quaternion.Lerp(transform.rotation, targetRot, 0.10f));                               
	} else {
	    targetPos = Vector3(-4.7f + enemyTrans.position.x, 1.8f + enemyTrans.position.y, -5.9f + enemyTrans.position.z);
	    targetRot = Quaternion.Euler(11, 199, 0);
	    rigidbody.MovePosition(Vector3.Lerp(transform.position, targetPos, 0.10f));
	    rigidbody.MoveRotation(Quaternion.Lerp(transform.rotation, targetRot, 0.10f));
	}        
    */
	advancePhaseClock();
}

function chooseSide() {
    /*
	var random: float = Random.Range(0f, 2f);
	                
	if (random > 1) {
	    if (!onRightSideNow) {
	        switchingSides = true;
	    }
	    onRightSideNow = true;
	} else {
	    if (onRightSideNow) {
	        switchingSides = true;
	    }
	    onRightSideNow = false;
	}
	*/

	phase = 5;
}

function switchSides() {
    /*
	if (switchingSides) {
	    if (onRightSideNow) {
	        rigidbody.AddForce(200f/timeToThrust, 0, 0);           
	    } else {
	        rigidbody.AddForce(-200f/timeToThrust, 0, 0);                       
	    }
	} 
	*/

	advancePhaseClock();
}

function setSideRotation() {
    /*
	if (switchingSides) {
	   if (onRightSideNow) {
	       targetRot = Quaternion.Euler(11, 199, 0);
	       rigidbody.MoveRotation(Quaternion.Lerp(transform.rotation, targetRot, 0.10f));             
	   } else {
	       targetRot = Quaternion.Euler(11, 161, 0);           
	       rigidbody.MoveRotation(Quaternion.Lerp(transform.rotation, targetRot, 0.10f));
	   }
	}
	*/
	advancePhaseClock();
}

function chasePos(speed) {
	var change = Vector3(0, 0, 0);
	var changeRot = Quaternion.Euler(0, 0, 0);
	var moveRot = Quaternion.Euler(0, 0, 0);

	change = targetPos - transform.position;
	
	rotSpeed = 2f;
	
	for (var i = 0; i < 3; i++) {
	
	    change[i] = Mathf.Min(change[i], speed);
	    change[i] = Mathf.Max(change[i], -speed);				
	}
					
	rigidbody.MovePosition(transform.position + change);
    rigidbody.MoveRotation(Quaternion.RotateTowards(transform.rotation, targetRot, rotSpeed));	
}