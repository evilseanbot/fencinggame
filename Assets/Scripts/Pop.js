function OnCollisionStay (collision: Collision) {
    if (collision.gameObject.name == "Cube") {
        GameObject.Destroy(gameObject);
    }

}