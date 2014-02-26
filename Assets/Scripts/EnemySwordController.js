var timeToReset = new Array(1.0f, 0.5f, 0.5f, 0.12f, 0, 0.12f, 0);
var timeElapsed = 0.0f;
var phase = 0;
var prefab : GameObject;
var onRightSideBefore: boolean = true;
var onRightSideNow : boolean = true;
var switchingSides: boolean = false;
var initiallyWaiting: boolean = true;
var timeToWait: float = 4f;
var alive: boolean = true;

function Start() {
    
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
        if (onRightSideNow) {
            rigidbody.AddForce(-80f, -80f, -160f);
        } else {
            rigidbody.AddForce(80f, -80f, -160f);        
        }
        advancePhaseClock();
    }

    // Phase 2 is recovering
    else if (phase == 2) {
        if (onRightSideNow) {
            rigidbody.AddForce(80f, 80f, 160f);
        } else {
            rigidbody.AddForce(-80f, 80f, 160f);        
        }
            
        advancePhaseClock();        
    }
    
    // Phase 3 is moving back to the home position.
    else if (phase == 3) {
        var xDiff: float; 
        var yDiff: float; 
        var zDiff: float;
        var xTarget: float;
        var yTarget: float;
        var zTarget: float;
    
        if (onRightSideNow) {
	        xDiff = transform.position.x - (4.7f);
	        yDiff = transform.position.y - 3.8f;
	        zDiff = transform.position.z - 4.1f;
	        
	        xTarget = transform.position.x - (xDiff/10f);
	        yTarget = transform.position.y - (yDiff/10f);
	        zTarget = transform.position.z - (zDiff/10f);
	        	                
            //rigidbody.MovePosition(Vector3(4, 3.8, 4.1)); 
            rigidbody.MovePosition(Vector3(xTarget, yTarget, zTarget)); 
            rigidbody.MoveRotation(Quaternion.Euler(11, 199, 0));             
                        
        } else {
	        xDiff = transform.position.x - (-4.7f);
	        yDiff = transform.position.y - 3.8f;
	        zDiff = transform.position.z - 4.1f;
	        
	        xTarget = transform.position.x - (xDiff/10f);
	        yTarget = transform.position.y - (yDiff/10f);
	        zTarget = transform.position.z - (zDiff/10f);
	        	                
            //rigidbody.MovePosition(Vector3(4, 3.8, 4.1)); 
            rigidbody.MovePosition(Vector3(xTarget, yTarget, zTarget)); 
            rigidbody.MoveRotation(Quaternion.Euler(11, 161, 0));                         
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
                rigidbody.AddForce(400f, 0, 0);           
            } else {
                rigidbody.AddForce(-400f, 0, 0);                       
            }
        } 
    
        advancePhaseClock();
    }
    
    // Phase 6 is setting the appropiate rotation.
    else if (phase == 6) {
      if (switchingSides) {
           if (onRightSideNow) {
               rigidbody.MoveRotation(Quaternion.Euler(11, 199, 0));             
           } else {
               rigidbody.MoveRotation(Quaternion.Euler(11, 161, 0));                        
           }
       }
       phase = 7;
    }
    
    // Phase 7 is reseting the phase + switchingSides.
    else if (phase == 7) {
        switchingSides = false;
        phase = 0;
    } 
}