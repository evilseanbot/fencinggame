#pragma strict

var timer: float = 0f;
var timeToLive: float = 1f;

function Start () {
    guiText.enabled = false;
}

function Update () {
    if (guiText.enabled) {
        timer += Time.deltaTime;
        if (timer > timeToLive) {
            timer = 0;
            guiText.enabled = false;
        }
    }
}

function Display() {
    guiText.enabled = true;
}