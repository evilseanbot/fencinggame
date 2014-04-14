using UnityEngine;
using System.Collections;
using Leap;

public class SwordController : MonoBehaviour {
	LeapManager myLeapManagerInstance;
	Transform upperBodyTrans;
	Transform player;
	public bool swordUp = false;

	void Start () {
		myLeapManagerInstance = (GameObject.Find("LeapManager") as GameObject).GetComponent(typeof(LeapManager)) as LeapManager;
		upperBodyTrans = GameObject.Find("UpperBody").transform; 
		player = GameObject.Find("Player").transform;
	}
	
	// Update is called once per frame
	void FixedUpdate () {
		Leap.Hand mHand = myLeapManagerInstance.frontmostHand();

		if (mHand.IsValid) {
			swordUp = true;
		} else {
			swordUp = false;
		}

		Vector3 targetPos = getTargetPos(mHand);
		Quaternion targetRot = getTargetRot(mHand);

		//moveWithForce(targetPos);
		moveWithMovePos(targetPos, targetRot);
	}

	Quaternion getTargetRot(Leap.Hand mHand) {
	    if (mHand.IsValid) {
			Vector3 palm_natural = new Vector3(mHand.Direction.Pitch,-mHand.Direction.Yaw,mHand.PalmNormal.Roll);
			palm_natural.y -= (player.eulerAngles.y/90);
			Quaternion targetRot = Quaternion.Euler (palm_natural*-90); 
			targetRot = Quaternion.Lerp(transform.localRotation, targetRot, 0.5f);
			return targetRot;
	    } else {
	      return Quaternion.Euler(22.5f, 90 + (player.eulerAngles.y), 0);
	    }
	}

	Quaternion combineRotations(Quaternion rotationA, Quaternion rotationB) {
		Quaternion combined = rotationB * rotationA;
		return combined;
	}

	Vector3 getTargetPos(Leap.Hand mHand) {
		if (mHand.IsValid) {
			Vector3 targetPos = mHand.PalmPosition.ToUnityTranslated();
			targetPos = player.TransformDirection (targetPos);
			targetPos.x += upperBodyTrans.position.x;
			targetPos.y += upperBodyTrans.position.y;
			targetPos.z += upperBodyTrans.position.z;
			targetPos = Vector3.Lerp (transform.localPosition, targetPos, 0.5f);     
			return targetPos;
		} else {
			return player.TransformDirection( new Vector3 (0f, 1.75f, 0f)) + upperBodyTrans.position; 
		}
	}

	void moveWithForce(Vector3 targetPos) {
		float xForce = 0;
		float yForce = 0;
		float zForce = 0;

		float force = 100;

		if(targetPos.x > transform.position.x) {
			xForce = force;
		}
		if(targetPos.y > transform.position.y) {
			yForce = force;
		}
		if(targetPos.z > transform.position.z) {
			zForce = force;
		}

		if(targetPos.x < transform.position.x) {
			xForce = -force;
		}
		if(targetPos.y < transform.position.y) {
			yForce = -force;
		}
		if(targetPos.z < transform.position.z) {
			zForce = -force;
		}



		rigidbody.AddForce (xForce, yForce, zForce);
	}

	void moveWithMovePos(Vector3 targetPos, Quaternion targetRot) {
		rigidbody.MovePosition (targetPos);
		rigidbody.MoveRotation (targetRot);
	}


}
