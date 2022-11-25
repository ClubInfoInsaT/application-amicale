# Push notifications

## Inside the app

Notification setup is done in `src/utils/Notifications.ts`

Deep linking (ability to open a specific page from a link such as
`campus-insat://event/353`) and Listening is done at the end of
`src/navigation/MainNavigator.tsx`

Subscription to channels is done in `src/screens/Home/Home Screen.tsx` (in
order to save token)

One can test deep linking on Android with

```
adb shell am start -W -n fr.amicaleinsat.application/.MainActivity -a android.intent.action.VIEW -d "campus-insat://notifications"
```

## Debugging notifications on Android

Access the shell of a connected device (physical or virtual) with `adb shell`

Inside adb shell :

`dumpsys notification --noredact` (combine with grep)

`cmd notification list` (`list` isn't available on all devices apparently)

`cmd notification get <key>` where `<key>` is something along the lines of
`"0|fr.amicaleinsat.application|0|campaign_collapse_key_X|X"` from `list`.
Use `"` to escape `|`.

## Using firebase

We use Firebase Cloud messaging to send Push Notifications to users.

You can set up campaigns manually using the [fcm Console](https://console.firebase.google.com/project/amicaleinsatoulouse/messaging)

### Sending notification in a development environment

Use [Google's OAuth
playground](https://developers.google.com/oauthplayground/) to
obtain an Authorization token.

You can send notifications with

```
curl -X POST \
-H "Authorization: Bearer <Authorization token>" \
-H "Content-Type: application/json" \
-H "X-Goog-User-Project: amicaleinsatoulouse" \
-d '{
"message":{
   "notification":{
     "title":"FCM amicale topical token Message",
     "body":"This  is an FCM Message"
   },"android":{
     "data":{"link":"campus-insat://notifications"},
     "notification":{
       "channel_id":"amicale7"
     },
   },
   "topic":"amicale"
}}' https://fcm.googleapis.com/v1/projects/amicaleinsatoulouse/messages:send
```

`message.android.data.link` is the link for deep linking.

`message.android.notification.channel_id` is the Android Notification Channel ID setup in `src/utils/Notifications.ts`.

`message.topic` is the channel subscribed to in `src/screens/Home/Home
Screen.tsx`

Further reading about [FCM send](https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages)

### Setting up authentication for use in production with the API

- Install the [Google Cloud Command Line
  Interface](https://cloud.google.com/sdk/docs/install-sdk)
- Set up a [service
  worker](https://console.cloud.google.com/iam-admin/serviceaccounts?project=amicaleinsatoulouse).
  You will likely need to give it a role similar to `Agent de
  service de gestion du service Firebase`.
- Create a key for this service worker
- Securely transfer the key file to the production environment
- Remove key from your system.
- `gcloud auth activate-service-account <service worker email>
  --key-file=amicaleinsatoulouse-XX.json`
- Ensure you are using the service worker (active) : `gcloud auth
  list`. If needed you can change the active accout with `cloud
  config set account <serice worker email>`
- Remove worker key file.

### Sending a notification in the production environment

```
curl -X POST \
-H "Authorization: Bearer $(gcloud auth application-default print-access-token)" \
-H "Content-Type: application/json" \
-H "X-Goog-User-Project: amicaleinsatoulouse" \
-d '{
"message":{
   "notification":{
     "title":"FCM amicale topical token Message",
     "body":"This  is an FCM Message"
   },"android":{
     "data":{"link":"campus-insat://notifications"},
     "notification":{
       "channel_id":"amicale7"
     },
   },
   "topic":"amicale"
}}' https://fcm.googleapis.com/v1/projects/amicaleinsatoulouse/messages:send
```

### Sending notifications to specific devices

Each app is identified by a token provided when the device first connects to
FCM. Version `5.2.10` and onwards, the token is
[stored](https://github.com/ClubInfoInsaT/application-amicale/commit/d76fab50e5d43fb882e0183c0fc2b676cdd47082).

Provide a `message.token` in place of the `message.topic` when sending
notifications via the API.
