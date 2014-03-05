var shoulder;

function Start() {
    shoulder = GameObject.Find("Shoulder");
}

function FixedUpdate () {
    transform.LookAt(shoulder.transform);
}