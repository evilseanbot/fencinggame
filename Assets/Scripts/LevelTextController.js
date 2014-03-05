function Start () {
    Invoke("setText", .1f);
    Invoke("destroy", 3f);
}

function setText() {
    var memory = GameObject.Find("PersistentMemory").GetComponent("PersistentMemoryController");    
    guiText.text = "Level " + memory.enemyReflexes;
}

function destroy() {
    GameObject.Destroy(gameObject);
}