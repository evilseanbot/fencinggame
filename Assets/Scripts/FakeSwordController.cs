using UnityEngine;
using System.Collections;

public class FakeSwordController : MonoBehaviour {
	public float targetYRot;

	// Update is called once per frame
	void FixedUpdate () {

		if (Time.time % 1f > 0.5f) {
			targetYRot = 90f;
		} else {
			targetYRot = -90f;
		}

		Quaternion moveRotation = Quaternion.RotateTowards (transform.rotation, Quaternion.Euler (0, targetYRot, 0), 240f * Time.deltaTime);
		rigidbody.MoveRotation (moveRotation);
	}
}
