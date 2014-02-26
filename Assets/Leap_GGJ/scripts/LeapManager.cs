/* 
 * Requires the LeapMotion SDK
 * http://developer.leapmotion.com
 * Unity Project Setup: https://developer.leapmotion.com/documentation/Languages/CSharpandUnity/Guides/Setup_Unity.html
 */

using UnityEngine;
using System.Collections;
using Leap;

public class LeapManager : MonoBehaviour {
	public Camera _mainCam;
	
	public static Controller _leapController = new Controller();
	public static float _forwardFingerContraint = 0.7f;//Min result of dot product between finger direction and hand direction to determine if finger is facing forward.
	
	private static Frame _currentFrame = Frame.Invalid;
	private static bool _pointerAvailible = false;
	private static Vector2 _pointerPositionScreen = new Vector3(0,0);
	private static Vector3 _pointerPositionWorld = new Vector3(0,0,0);

	public static Finger pointingFigner(Hand hand)
	{
		Finger forwardFinger = Finger.Invalid;
		ArrayList forwardFingers = forwardFacingFingers(hand);
		
		if(forwardFingers.Count > 0)
		{
			
			float minZ = float.MaxValue;
			
			foreach(Finger finger in forwardFingers)
			{
				if(finger.TipPosition.z < minZ)
				{
					minZ = finger.TipPosition.z;
					forwardFinger = finger;
				}
			}
		}
		
		return forwardFinger;
	}
	
	public static ArrayList forwardFacingFingers(Hand hand)
	{
		ArrayList forwardFingers = new ArrayList();
		
		foreach(Finger finger in hand.Fingers)
		{
			if(isForwardRelativeToHand(finger, hand)) { forwardFingers.Add(finger); }
		}
		
		return forwardFingers;
	}
	
	public static bool isHandOpen(Hand hand)
	{
		return hand.Fingers.Count > 2;
	}

	public static bool isForwardRelativeToHand(Pointable item, Hand hand)
	{
		return Vector3.Dot((item.TipPosition.ToUnity() - hand.PalmPosition.ToUnity()).normalized, hand.Direction.ToUnity()) > _forwardFingerContraint;
	}
	
	// Use this for initialization
	void Start () {
		if(_mainCam == null)
		{
			_mainCam = (GameObject.FindGameObjectWithTag("MainCamera") as GameObject).GetComponent(typeof(Camera)) as Camera;
		}
	}
	
	// Update is called once per frame
	void Update () {
		_currentFrame = _leapController.Frame();

		Hand primeHand = frontmostHand();

		Finger primeFinger = Finger.Invalid;

		if(primeHand.IsValid)
		{
			primeFinger = pointingFigner(primeHand);

			if(primeFinger.IsValid) 
			{ 
				_pointerAvailible = true; 

				_pointerPositionWorld = primeFinger.TipPosition.ToUnityTranslated();
				_pointerPositionScreen = _mainCam.WorldToScreenPoint(_pointerPositionWorld);
			}
			else
			{ 
				_pointerAvailible = false; 
			}
		}
	}
	
	public Vector2[] getScreenFingerPositions(Hand hand)
	{
		Vector2[] retArr = new Vector2[hand.Fingers.Count];

		for(int i=0;i<hand.Fingers.Count;i++) { retArr[i] = _mainCam.WorldToScreenPoint(hand.Fingers[i].TipPosition.ToUnityTranslated()); }

		return retArr;
	}

	public Vector3[] getWorldFingerPositions(Hand hand)
	{
		Vector3[] retArr = new Vector3[hand.Fingers.Count];
		
		for(int i=0;i<hand.Fingers.Count;i++) { retArr[i] = hand.Fingers[i].TipPosition.ToUnityTranslated(); }
		
		return retArr;
	}

	//Get the frontmost hand
	public Hand frontmostHand()
	{
		float minZ = float.MaxValue;
		Hand forwardHand = Hand.Invalid;

		foreach(Hand hand in _currentFrame.Hands)
		{
			if(hand.PalmPosition.z < minZ)
			{
				minZ = hand.PalmPosition.z;
				forwardHand = hand;
			}
		}

		return forwardHand;
	}

	//Getters

	public Controller leapController{
		get { return _leapController; }
	}

	public Frame currentFrame
	{
		get { return _currentFrame; }
	}

	public bool pointerAvailible {
		get{ return _pointerAvailible; }
	}

	public Vector2 pointerPositionScreen {
		get { return _pointerAvailible ? _pointerPositionScreen : Vector2.zero; }
	}

	public Vector3 pointerPositionWorld {
		get { return _pointerAvailible ? _pointerPositionWorld : Vector3.zero; }
	}
}
