using UnityEngine;
using System.Collections;
using Leap;

public class SwordController : MonoBehaviour {
	LeapManager myLeapManagerInstance;
	
	// Use this for initialization
	void Start () {
		myLeapManagerInstance = (GameObject.Find("LeapManager") as GameObject).GetComponent(typeof(LeapManager)) as LeapManager;
	}
	
	// Update is called once per frame
	void Update () {
		gameObject.transform.localPosition = myLeapManagerInstance.frontmostHand().PalmPosition.ToUnityTranslated();
		//gameObject.transform.forward = myLeapManagerInstance.frontmostHand().Direction.ToUnity();
		//gameObject.transform.up = -1 * myLeapManagerInstance.frontmostHand().PalmNormal.ToUnity();		
		//gameObject.transform.right= myLeapManagerInstance.frontmostHand().
		//gameObject.rigidbody.MovePosition (myLeapManagerInstance.frontmostHand().PalmPosition.ToUnityTranslated());

		Leap.Hand mHand = myLeapManagerInstance.frontmostHand();

		Vector3 tool_natural = new Vector3(mHand.Direction.Pitch,-mHand.Direction.Yaw,mHand.PalmNormal.Roll);
		//gameObject.transform.localRotation = Quaternion.Euler(tool_natural*-90);
		gameObject.rigidbody.MoveRotation (Quaternion.Euler(tool_natural*-90));
	}
}
