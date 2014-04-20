function OnCollisionStay (collision: Collision) {
    if (collision.gameObject.name == "Sword") {
        if (collision.gameObject.GetComponent("SwordController").swordUp) {
            //rigidbody.constraints = RigidbodyConstraints.None;
            rigidbody.isKinematic = false;
	    }
    }
}