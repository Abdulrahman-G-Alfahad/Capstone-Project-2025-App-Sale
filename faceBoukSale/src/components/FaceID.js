import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Modal,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { WebView } from "react-native-webview";
import { Camera } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";

const FACEIO_PUBLIC_ID = "fioa5917";

const FaceID = ({
  isVisible,
  onClose,
  onSuccess,
  userData,
  mode = "enroll",
  setFaceId,
}) => {
  const [hasPermission, setHasPermission] = useState(null);
  const webViewRef = useRef(null);
  const { email, username, fullName } = userData;

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
      if (status !== "granted") {
        Alert.alert(
          "Camera Permission Required",
          "Please enable camera access in your device settings to use Face ID."
        );
      }
    })();
  }, []);

  const handleFaceIOMessage = (event) => {
    console.log("handleFaceIOMessage called");
    try {
      const message = JSON.parse(event.nativeEvent.data);
      console.log("FaceIO message received:", message);

      if (message.type === "status") {
        console.log("Status update:", message.message);
      } else if (message.type === "success") {
        if (mode === "enroll") {
          // Store the facial ID for future authentication
          setFaceId(message.data.facialId);
          const { facialId, timestamp, details } = message.data;
          console.log("Enrollment successful:", {
            facialId,
            timestamp,
            details,
          });
        } else {
          // Verify the authenticated user's payload
          const { facialId, payload } = message.data;
          setFaceId(facialId);
          console.log("Authentication successful:", { facialId, payload });
        }
        onSuccess(message.data);
        onClose();
      } else if (message.type === "error") {
        console.log("FaceIO error:", message.error);

        if (message.code === 2 && mode === "enroll") {
          Alert.alert(
            "Face Already Registered",
            "This face is already registered. Would you like to try logging in instead?",
            [
              {
                text: "Yes",
                onPress: () => {
                  console.log("Switching to authentication mode");
                },
              },
              {
                text: "No",
                style: "cancel",
              },
            ]
          );
        } else {
          Alert.alert(
            mode === "enroll"
              ? "Face ID Setup Failed"
              : "Face ID Authentication Failed",
            message.error,
            [
              {
                text: "Try Again",
                onPress: () => {
                  webViewRef.current?.reload();
                },
              },
              {
                text: "Cancel",
                style: "cancel",
                onPress: onClose,
              },
            ]
          );
        }
      }
    } catch (error) {
      console.error("Error handling FaceIO message:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
      onClose();
    }
  };

  const faceIOScript = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <meta http-equiv="Content-Security-Policy" content="default-src * 'self' 'unsafe-inline' 'unsafe-eval' data: gap: blob: mediastream: https://ssl.gstatic.com https://cdn.faceio.net https://api.faceio.net; script-src * 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.faceio.net https://api.faceio.net; img-src * 'self' data: blob: https://cdn.faceio.net https://api.faceio.net; media-src * 'self' blob: mediastream:; connect-src * 'self' blob: mediastream: https://cdn.faceio.net https://api.faceio.net; style-src * 'self' 'unsafe-inline';">
        <script>
          window.faceioSDKLoaded = new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.faceio.net/fio.js';
            script.async = true;
            script.onload = () => {
              if (typeof faceIO !== 'undefined') {
                resolve();
              } else {
                reject(new Error('FaceIO SDK loaded but not initialized'));
              }
            };
            script.onerror = () => reject(new Error('Failed to load FaceIO SDK'));
            document.head.appendChild(script);
          });
        </script>
        <style>
          body { 
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: #1f1d35;
            font-family: -apple-system, system-ui, BlinkMacSystemFont;
            overflow: hidden;
          }
          #status {
            color: white;
            position: fixed;
            top: 20px;
            left: 0;
            right: 0;
            text-align: center;
            padding: 10px;
            font-size: 16px;
            z-index: 1000;
            background: rgba(0,0,0,0.7);
          }
          #loading {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            text-align: center;
            z-index: 1000;
          }
        </style>
      </head>
      <body>
        <div id="status">Loading FaceIO SDK...</div>
        <div id="loading">Please wait...</div>
        <div id="faceio-modal"></div>

        <script>
          let faceioInstance = null;

          function updateStatus(message) {
            const statusEl = document.getElementById('status');
            if (statusEl) {
              statusEl.textContent = message;
              console.log(message);
              window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'status', message }));
            }
          }

          async function initFaceIO() {
            try {
              updateStatus('Waiting for FaceIO SDK...');
              await window.faceioSDKLoaded;
              
              updateStatus('Initializing FaceIO...');
              console.log('Creating faceIO instance with public ID:', '${FACEIO_PUBLIC_ID}');
              faceioInstance = new faceIO('${FACEIO_PUBLIC_ID}');
              
              if (!faceioInstance) {
                throw new Error('Failed to create FaceIO instance');
              }
              
              console.log('FaceIO instance created successfully');
              updateStatus('FaceIO initialized successfully');
              
              await new Promise(resolve => setTimeout(resolve, 1000));
              await startFaceIO();
            } catch (error) {
              console.error('FaceIO initialization error:', error);
              updateStatus('Error: ' + (error.message || 'Failed to initialize FaceIO'));
              window.ReactNativeWebView.postMessage(JSON.stringify({ 
                type: 'error', 
                error: error.message || 'Failed to initialize FaceIO',
                stack: error.stack
              }));
            }
          }

          async function startFaceIO() {
            try {
              document.getElementById('loading').style.display = 'none';
              
              if ('${mode}' === 'enroll') {
                updateStatus('Starting face enrollment...');
                const userInfo = await faceioInstance.enroll({
                  locale: "auto",
                  payload: {
                    email: "${email}",
                    userId: "${username}",
                    fullName: "${fullName}"
                  },
                  enrollIntroTimeout: 1,
                  selectMultipleDataPoints: true,
                  maxRetries: 3,
                  userConsent: false
                });
                
                updateStatus('Enrollment successful!');
                console.log('Enrollment successful:', userInfo);
                window.ReactNativeWebView.postMessage(JSON.stringify({ 
                  type: 'success', 
                  data: {
                    ...userInfo,
                    facialId: userInfo.facialId,
                    timestamp: userInfo.timestamp,
                    details: userInfo.details
                  }
                }));
              } else {
                updateStatus('Starting face authentication...');
                const userData = await faceioInstance.authenticate({
                  locale: "auto",
                  payload: false
                });
                
                updateStatus('Authentication successful!');
                console.log('Authentication successful:', userData);
                window.ReactNativeWebView.postMessage(JSON.stringify({ 
                  type: 'success', 
                  data: {
                    facialId: userData.facialId,
                    payload: userData.payload,
                    timestamp: userData.timestamp
                  }
                }));
              }
            } catch (error) {
              console.error('FaceIO Error:', error);
              let errorMessage = error.message || \`Face \${mode === 'enroll' ? 'enrollment' : 'authentication'} failed\`;
              
              if (error.code) {
                switch(error.code) {
                  case 1: errorMessage = 'Missing FaceIO dependencies.'; break;
                  case 2: errorMessage = mode === 'enroll' ? 'Face already registered. Please try logging in instead.' : 'Face not registered. Please enroll first.'; break;
                  case 3: errorMessage = 'Face detection permission denied. Please enable camera access.'; break;
                  case 4: errorMessage = 'Face detection initialization failed. Please try again.'; break;
                  case 5: errorMessage = 'No face was found. Please ensure proper lighting.'; break;
                  case 6: errorMessage = 'Session expired. Please try again.'; break;
                  case 7: errorMessage = 'Invalid authentication payload.'; break;
                  case 8: errorMessage = 'Face detection timeout. Please try again.'; break;
                  case 9: errorMessage = 'No face detected. Please ensure good lighting and face the camera.'; break;
                  case 10: errorMessage = 'Face not found. Please try again.'; break;
                  case 11: errorMessage = 'Authentication failed. Face not recognized.'; break;
                  case 12: errorMessage = 'Too many requests. Please try again later.'; break;
                  case 13: errorMessage = 'Application not enrolled.'; break;
                  case 14: errorMessage = 'Application not configured properly.'; break;
                }
              }
              
              updateStatus('Error: ' + errorMessage);
              window.ReactNativeWebView.postMessage(JSON.stringify({ 
                type: 'error', 
                error: errorMessage,
                code: error.code
              }));
            }
          }

          document.addEventListener('DOMContentLoaded', () => {
            console.log('Document ready, initializing FaceIO...');
            initFaceIO().catch(error => {
              console.error('Failed to initialize FaceIO:', error);
              updateStatus('Error: ' + error.message);
            });
          });
        </script>
      </body>
    </html>
  `;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.faceIOModalOverlay}>
        <View style={styles.faceIOModalContent}>
          <View style={styles.faceIOHeader}>
            <Text style={styles.faceIOHeaderText}>
              Face ID {mode === "enroll" ? "Setup" : "Authentication"}
            </Text>
            <TouchableOpacity
              style={styles.closeFaceIOButton}
              onPress={onClose}
            >
              <Ionicons name="close-circle" size={28} color="#9991b1" />
            </TouchableOpacity>
          </View>
          <WebView
            ref={webViewRef}
            source={{
              html: faceIOScript,
              baseUrl: "https://cdn.faceio.net",
            }}
            onMessage={handleFaceIOMessage}
            style={styles.webView}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            mediaPlaybackRequiresUserAction={false}
            allowsInlineMediaPlayback={true}
            cameraAccessOnPermission={true}
            originWhitelist={["*"]}
            mixedContentMode="always"
            allowsFullscreenVideo={true}
            onShouldStartLoadWithRequest={(request) => {
              console.log("Load request:", request);
              return true;
            }}
            startInLoadingState={true}
            useWebKit={true}
            scrollEnabled={false}
            bounces={false}
            cacheEnabled={false}
            incognito={true}
            allowsBackForwardNavigationGestures={false}
            applicationNameForUserAgent="BWaihy-iOS"
            webviewDebuggingEnabled={true}
            androidLayerType="hardware"
            androidHardwareAccelerationDisabled={false}
            setSupportMultipleWindows={false}
            overScrollMode="never"
            textZoom={100}
            pullToRefreshEnabled={false}
            injectedJavaScript={`
              window.onerror = function(message, source, lineno, colno, error) {
                console.log('JavaScript Error:', message, source, lineno);
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'error',
                  error: 'JavaScript Error: ' + message,
                  source: source,
                  line: lineno
                }));
                return true;
              };

              (function() {
                var originalConsoleLog = console.log;
                console.log = function() {
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'log',
                    message: Array.from(arguments).join(' ')
                  }));
                  originalConsoleLog.apply(console, arguments);
                };
              })();

              (function() {
                var originalConsoleError = console.error;
                console.error = function() {
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'error',
                    message: Array.from(arguments).join(' ')
                  }));
                  originalConsoleError.apply(console, arguments);
                };
              })();
              true;
            `}
            onNavigationStateChange={(navState) => {
              console.log("Navigation State:", navState);
            }}
            onLoadEnd={() => {
              console.log("WebView load completed");
            }}
            onLoadStart={() => {
              console.log("WebView load started");
            }}
            onError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              console.warn("WebView error:", nativeEvent);
              Alert.alert(
                "Error",
                "Failed to load face detection. Please check your internet connection and try again.",
                [
                  {
                    text: "Retry",
                    onPress: () => {
                      webViewRef.current?.reload();
                    },
                  },
                  {
                    text: "Cancel",
                    style: "cancel",
                    onPress: onClose,
                  },
                ]
              );
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  faceIOModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(20, 30, 48, 0.98)",
    justifyContent: "center",
    alignItems: "center",
  },
  faceIOModalContent: {
    flex: 1,
    width: "100%",
    backgroundColor: "#141E30",
    borderRadius: 24,
    overflow: "hidden",
    margin: 16,
    marginTop: 60,
    marginBottom: 30,
    shadowColor: "#A78BFA",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 16,
    borderWidth: 1,
    borderColor: "rgba(167, 139, 250, 0.2)",
  },
  faceIOHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#141E30",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(167, 139, 250, 0.2)",
  },
  faceIOHeaderText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#E8F0FE",
    letterSpacing: 0.5,
  },
  webView: {
    flex: 1,
    backgroundColor: "#141E30",
  },
  closeFaceIOButton: {
    padding: 8,
  },
});

export default FaceID;
