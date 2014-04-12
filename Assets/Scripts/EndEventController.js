function OnCollisionStay (collision: Collision) {
    if (collision.gameObject.name == "Player") {
        Application.LoadLevel("initial");
	}
}
