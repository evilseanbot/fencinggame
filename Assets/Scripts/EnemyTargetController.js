function OnCollisionStay (collision: Collision) {
    if (collision.gameObject.name == "Sword") {
        //GameObject.Find("GUI Text").GetComponent("GuiTimedDisplay").Display();
        //GameObject.Destroy(GameObject.Find("EnemySword"));
        rigidbody.isKinematic = false;
        var enemySword = GameObject.Find("EnemySword");
        enemySword.GetComponent("EnemySwordController").alive = false;
        enemySword.rigidbody.useGravity = true;
        enemySword.rigidbody.drag = 0;
        enemySword.rigidbody.angularDrag = 0.5;
    }
}