var enemyReflexes = 1;

function Start() {
    var duplicates = GameObject.FindGameObjectsWithTag("Memory").length;
    if (duplicates > 1) {
        GameObject.Destroy(gameObject);
    }
    Application.DontDestroyOnLoad(gameObject);
}