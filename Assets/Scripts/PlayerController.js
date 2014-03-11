private var zVel = 0f;
var wounded = false;

function FixedUpdate () {
    zVel = 0f;
    var walkingSpeed = 0.12f;
    
    if (lunging()) {
        walkingSpeed = 0.06f;
    }

    if(Input.GetKey("w")) {
        zVel = walkingSpeed;
    } else if (Input.GetKey("s")) {
        zVel = -walkingSpeed;
    } else {
        zVel = 0;
    }
    
    if (Input.GetKey("q")) {
        startLunging();    
    } else {
        startUnLunging();
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
    
    transform.position.z += zVel;
    
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