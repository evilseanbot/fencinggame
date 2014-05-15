using UnityEngine;
using System.Collections;

public class weaponCollider : MonoBehaviour {

    void OnCollisionStay (Collision col) {
		GameObject colCube = GameObject.Find ("CollisionCube");
		colCube.transform.localScale = new Vector3(0.2f, 0.2f, 0.2f);
		colCube.transform.position = col.contacts [0].point;

		Vector3 pointOfContact = col.contacts [0].point;
		float distanceFromYourCenter = Vector3.Distance (transform.position, pointOfContact);

		float power = 100f / Mathf.Pow (100, distanceFromYourCenter);
		//Debug.Log (power);

		rigidbody.mass = power;

	}

	void OnCollisionExit (Collision col) {
		GameObject colCube = GameObject.Find ("CollisionCube");
		colCube.transform.localScale = Vector3.zero;
		//colCube.transform.position = col.contacts [0].point;
		rigidbody.mass = 1;

	}
}
