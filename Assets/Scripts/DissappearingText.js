#pragma strict

function Start () {
    Invoke("destroy", 5f);
}

function destroy() {
    GameObject.Destroy(gameObject);
}