﻿var timeToReset;
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
var enemy: GameObject;

function Start() {
    var memory = GameObject.Find("PersistentMemory").GetComponent("PersistentMemoryController");
    timeToThrust = 0.5f / memory.enemyReflexes;
    timeToReset = new Array(timeToThrust*2f, timeToThrust, timeToThrust, timeToThrust, 0, timeToThrust/5f, timeToThrust);
    
    enemy = GameObject.Find("Enemy");
    
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
        timeElapsed += Time.deltaTime;
        
        if (timeElapsed > timeToWait) {
            timeElapsed = 0;
            initiallyWaiting = false;        
        } else {
            return;
        }
    }

    // Phase 0 is waiting.
    if (phase == 0) {
        advancePhaseClock();
    }
    
    // Phase 1 is thrusting
    else if (phase == 1) {
        enemy.GetComponent("Animator").SetBool("lunging", true);    
        enemy.GetComponent("Animator").SetBool("recovering", false);    
        
        if (onRightSideNow) {
            rigidbody.AddForce(-40f/timeToThrust, -40f/timeToThrust, -80f/timeToThrust);
        } else {
            rigidbody.AddForce(40f/timeToThrust, -40f/timeToThrust, -80f/timeToThrust);        
        }
        advancePhaseClock();
    }

    // Phase 2 is recovering
    else if (phase == 2) {
        enemy.GetComponent("Animator").SetBool("lunging", false);    
        enemy.GetComponent("Animator").SetBool("recovering", true);    
    
        if (onRightSideNow) {
            rigidbody.AddForce(40f/timeToThrust, 40f/timeToThrust, 80f/timeToThrust);
        } else {
            rigidbody.AddForce(-40f/timeToThrust, 40f/timeToThrust, 80f/timeToThrust);        
        }
            
        advancePhaseClock();        
    }
    
    // Phase 3 is moving back to the home position.
    else if (phase == 3) {       
        var targetPos: Vector3;
        var targetRot: Quaternion;
        var enemyTrans: Transform = GameObject.Find("Enemy").transform;
    
        if (onRightSideNow) {
            targetPos = Vector3(4.7f + enemyTrans.position.x, 3.8f + enemyTrans.position.y, -5.9f + enemyTrans.position.z);
            targetRot = Quaternion.Euler(11, 199, 0);

            rigidbody.MovePosition(Vector3.Lerp(transform.position, targetPos, 0.10f));
            rigidbody.MoveRotation(Quaternion.Lerp(transform.rotation, targetRot, 0.10f));                               
        } else {
            targetPos = Vector3(-4.7f + enemyTrans.position.x, 3.8f + enemyTrans.position.y, -5.9f + enemyTrans.position.z);
            targetRot = Quaternion.Euler(11, 199, 0);
            rigidbody.MovePosition(Vector3.Lerp(transform.position, targetPos, 0.10f));
            rigidbody.MoveRotation(Quaternion.Lerp(transform.rotation, targetRot, 0.10f));
        }        
        
        advancePhaseClock();
    
    }

    // Phase 4 is choosing a side to switch to.
    else if (phase == 4) {
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
    
    // Phase 5 is switching over to a different side.
    else if (phase == 5) {
        if (switchingSides) {
            if (onRightSideNow) {
                rigidbody.AddForce(200f/timeToThrust, 0, 0);           
            } else {
                rigidbody.AddForce(-200f/timeToThrust, 0, 0);                       
            }
        } 
    
        advancePhaseClock();
    }
    
    // Phase 6 is setting the appropiate rotation.
    else if (phase == 6) {
      if (switchingSides) {
           if (onRightSideNow) {
               targetRot = Quaternion.Euler(11, 199, 0);
               rigidbody.MoveRotation(Quaternion.Lerp(transform.rotation, targetRot, 0.10f));             
           } else {
               targetRot = Quaternion.Euler(11, 161, 0);           
               rigidbody.MoveRotation(Quaternion.Lerp(transform.rotation, targetRot, 0.10f));
           }
       }
       advancePhaseClock();
    }
    
    // Phase 7 is reseting the phase + switchingSides.
    else if (phase == 7) {
        switchingSides = false;
        phase = 0;
    } 
}