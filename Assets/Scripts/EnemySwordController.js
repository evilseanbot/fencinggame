var timeToReset;
var timeElapsed = 0.0f;
var phase = 0;
var prefab : GameObject;
var onRightSideNow : boolean = true;
var switchingSides: boolean = false;
var alive: boolean = true;
var timeToThrust = 0.5f;
var enemyUpperBody: GameObject;
var enemy: GameObject;
var player: GameObject;
var targetPos: Vector3;
var targetRot: Quaternion;
var startingPos: Vector3;
var startingRot: Quaternion;
private var posSpeed = 0.015f;
private var rotSpeed = 3f;
var shoulder : GameObject;

var oldZPos: float = 0f;
var oldUpperBodyPos: Vector3;

// Set up the sword positions.
var swordPositions = new Hashtable();
swordPositions["rest"] = new Hashtable();
swordPositions["rest"]["6"] = new Hashtable();
swordPositions["rest"]["6"]["position"] = new Vector3(0.3f, 1.8f, -0.4f);
swordPositions["rest"]["6"]["rotation"] = new Vector3(-10, -10, 0);

swordPositions["rest"]["4"] = new Hashtable();
swordPositions["rest"]["4"]["position"] = new Vector3(-0.3f, 1.8f, -0.4f);
swordPositions["rest"]["4"]["rotation"] = new Vector3(-10, 10, 0);

swordPositions["pikeRest"] = new Hashtable();
swordPositions["pikeRest"]["6"] = new Hashtable();
swordPositions["pikeRest"]["6"]["position"] = new Vector3(0.3f, 1.8f, -0.4f);
swordPositions["pikeRest"]["6"]["rotation"] = new Vector3(-5, -10, 0);

swordPositions["pikeRest"]["4"] = new Hashtable();
swordPositions["pikeRest"]["4"]["position"] = new Vector3(-0.3f, 1.8f, -0.4f);
swordPositions["pikeRest"]["4"]["rotation"] = new Vector3(-5, 10, 0);


swordPositions["attack"] = new Hashtable();
swordPositions["attack"]["6"] = new Hashtable();
swordPositions["attack"]["6"]["position"] = new Vector3(0.1f, 1.8f, 0f);
swordPositions["attack"]["6"]["rotation"] = new Vector3(-7, -3, 0);

swordPositions["attack"]["4"] = new Hashtable();
swordPositions["attack"]["4"]["position"] = new Vector3(-0.1f, 1.8f, 0f);
swordPositions["attack"]["4"]["rotation"] = new Vector3(-7, 3, 0);

swordPositions["pikeAttack"] = new Hashtable();
swordPositions["pikeAttack"]["6"] = new Hashtable();
swordPositions["pikeAttack"]["6"]["position"] = new Vector3(0.1f, 1.8f, 0f);
swordPositions["pikeAttack"]["6"]["rotation"] = new Vector3(0, -3, 0);

swordPositions["pikeAttack"]["4"] = new Hashtable();
swordPositions["pikeAttack"]["4"]["position"] = new Vector3(-0.1f, 1.8f, 0f);
swordPositions["pikeAttack"]["4"]["rotation"] = new Vector3(0, 3, 0);


function Start() {
    //var memory = GameObject.Find("PersistentMemory").GetComponent("PersistentMemoryController");
    timeToThrust = Mathf.Max(0.25f, 1f);
    timeToReset = new Array(timeToThrust*0.5f, timeToThrust*0.5f, 0, timeToThrust, 0, timeToThrust, 0, timeToThrust);
    
    // Change this to refer to just 'upperBody', get more symettry between player / enemies.
    enemy = gameObject.transform.parent.parent.gameObject;
    enemyUpperBody = enemy.transform.FindChild("EnemyUpperBody").gameObject;    
    oldUpperBodyPos = enemyUpperBody.transform.position;
    
    shoulder = gameObject.transform.parent.FindChild("IKArm").FindChild("ikArm").gameObject;    
    
    // Possibly change this to allow multiple players / allies.
    player = GameObject.Find("Player");
    
}

function advancePhaseClock() {
	timeElapsed += Time.deltaTime;
	if (timeElapsed > timeToReset[phase]) {
	    timeElapsed = 0;
	    phase += 1;
	    enemy.transform.LookAt(player.transform);
	}
}

function FixedUpdate() {

    snapToArmsLength();

    followEnemyMovement();


    closestOpponentZone = enemy.GetComponent("EnemyTargetController").closestOpponentZone;
    if (closestOpponentZone == 4) {
        return;
    }
    
    if (closestOpponentZone == 3) {
        if (enemy.GetComponent("EnemyTargetController").weapon == "Pike") {
	        transform.rotation = Quaternion.Euler(-90f, (enemyUpperBody.transform.eulerAngles.y), 0);
	        transform.position = enemyUpperBody.transform.TransformDirection( new Vector3 (0f, 1.75f, 0.8f)) + enemyUpperBody.transform.position;         
        } else {
	        transform.rotation = Quaternion.Euler(-22f, (enemyUpperBody.transform.eulerAngles.y), 0);
	        transform.position = enemyUpperBody.transform.TransformDirection( new Vector3 (0f, 1.75f, 0.5f)) + enemyUpperBody.transform.position; 
	    }
	    return;
        
    }

    if (!alive) {
        return;
    }
            
    // Phase 0 is waiting.
    if (phase == 0) {
        startingPos = transform.position;
        startingRot = transform.rotation;
        
        //chasePos(0.10f);        
    
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
        
    
    // Phase 4 is choosing a side to switch to.
    else if (phase == 4) {
        startingPos = transform.position;
        startingRot = transform.rotation;    
        chooseSide();
    }
    
    // Phase 5 is switching over to a different side.
    else if (phase == 5) {
        switchSides();
    }
    
    else if (phase == 6) {
        switchingSides = false;
        phase = 0;
    }

    else if (phase == 7) {
        switchingSides = false;
        phase = 0;
    }
    
    snapToArmsLength();
        
    /*
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

function followEnemyMovement() {
    var enemyMovement : Vector3 = enemyUpperBody.transform.position - oldUpperBodyPos;
    rigidbody.MovePosition(transform.position + enemyMovement);
    oldUpperBodyPos = enemyUpperBody.transform.position;
}

function snapToArmsLength() {
     var distance = Vector3.Distance(transform.position, shoulder.transform.position);    
          
     if (distance > 0.65f) {
         var difference : Vector3 = transform.position - shoulder.transform.position;
         var distanceToArmsLength = (distance - 0.65f);
         var differenceFromArmsLength = difference * (distanceToArmsLength / distance);
         
         rigidbody.MovePosition(transform.position - differenceFromArmsLength);
     }
}

function thrust() {
    var selectedSwordPosition;

	//enemyUpperBody.GetComponent("Animator").SetBool("lunging", true);    
	//enemyUpperBody.GetComponent("Animator").SetBool("recovering", false);    

	if (enemy.GetComponent("EnemyTargetController").weapon == "Pike") {
		if (onRightSideNow) {
		    selectedSwordPosition = swordPositions["pikeAttack"]["6"];
	    } else {
	        selectedSwordPosition = swordPositions["pikeAttack"]["4"];
	    }
	
	} else {
		if (onRightSideNow) {
		    selectedSwordPosition = swordPositions["attack"]["6"];
	    } else {
	        selectedSwordPosition = swordPositions["attack"]["4"];
	    }
	}

    setTargetToSwordPosition(selectedSwordPosition);    
    chasePos(posSpeed);			
	advancePhaseClock(); 
}

function recover() {
    var selectedSwordPosition;

	//enemyUpperBody.GetComponent("Animator").SetBool("lunging", false);    
	//enemyUpperBody.GetComponent("Animator").SetBool("recovering", true);    
	
	if (enemy.GetComponent("EnemyTargetController").weapon == "Pike") {
		if (onRightSideNow) {
		    selectedSwordPosition = swordPositions["pikeRest"]["6"];
	    } else {
	        selectedSwordPosition = swordPositions["pikeRest"]["4"];
	    }
	
	} else {
		if (onRightSideNow) {
		    selectedSwordPosition = swordPositions["rest"]["6"];
	    } else {
	        selectedSwordPosition = swordPositions["rest"]["4"];
	    }
	}
    
    setTargetToSwordPosition(selectedSwordPosition);
	chasePos(posSpeed);
	advancePhaseClock();        
}

function setTargetToSwordPosition(selectedSwordPosition) {
    var endTargetPos = enemyUpperBody.transform.TransformDirection(selectedSwordPosition["position"]) + enemyUpperBody.transform.position;
    targetPos = Vector3.Lerp(startingPos, endTargetPos, timeElapsed / timeToReset[phase]);
    var endTargetRot = Quaternion.Euler(selectedSwordPosition["rotation"].x, 
         selectedSwordPosition["rotation"].y + enemyUpperBody.transform.rotation.eulerAngles.y, 
         selectedSwordPosition["rotation"].z);
    targetRot = Quaternion.Lerp(startingRot, endTargetRot, timeElapsed / timeToReset[phase]);	
}

function chooseSide() {
    
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

	phase = 5;
}

function switchSides() {
    recover();
	advancePhaseClock();
}

function chasePos(speed) {
	var change = Vector3(0, 0, 0);
	var changeRot = Quaternion.Euler(0, 0, 0);
	var moveRot = Quaternion.Euler(0, 0, 0);

	change = targetPos - transform.position;
		
	for (var i = 0; i < 3; i++) {
	
	    change[i] = Mathf.Min(change[i], speed);
	    change[i] = Mathf.Max(change[i], -speed);				
	}
					
	rigidbody.MovePosition(transform.position + change);
    rigidbody.MoveRotation(Quaternion.RotateTowards(transform.rotation, targetRot, rotSpeed));	
}