using UnityEngine;
using System.Collections;
using Leap;

public class RevolvingCamera : MonoBehaviour {
	public GameObject _targetObject;
	public Vector3 _controlMin;
	public Vector3 _controlMax;
	public Vector2 _distanceLimits;

	private LeapManager _leapManager;

	// Use this for initialization
	void Start () {
		_leapManager = (GameObject.Find("LeapManager") as GameObject).GetComponent(typeof(LeapManager)) as LeapManager;
	}
	
	// Update is called once per frame
	void Update () {
		if(_leapManager.frontmostHand().IsValid && LeapManager.isHandOpen(_leapManager.frontmostHand()))
		{
			Vector3 handLocation = _leapManager.frontmostHand().PalmPosition.ToUnityTranslated();

			Quaternion yRotation = Quaternion.Euler(new Vector3(
				0,
				360 - (Mathf.Clamp((handLocation.x - _controlMin.x) / (_controlMax.x - _controlMin.x), 0, 1.0f) * 360.0f) + 90.0f,
				0
				));

			Quaternion xRotation = Quaternion.Euler(new Vector3(
				(Mathf.Clamp((handLocation.y - _controlMin.y) / (_controlMax.y - _controlMin.y), 0, 1.0f) * 180.0f) + 90.0f,
				0,
				0));

			Vector3 directionVector = yRotation * xRotation * Vector3.forward;

			float dist = ((1.0f - Mathf.Clamp((handLocation.z - _controlMin.z)/(_controlMax.z - _controlMin.x),0.0f,1.0f)) * (_distanceLimits.y - _distanceLimits.x)) + _distanceLimits.x;
			gameObject.transform.position = directionVector * dist;
			gameObject.transform.LookAt(_targetObject.transform);
		}
	}
}
