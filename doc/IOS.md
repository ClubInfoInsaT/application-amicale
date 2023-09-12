## Renewing Apple distribution certificates

1. Create a [Certificate Signing Request][certsignreq] on a mac (see
   `INSTALL.md` for instructions for a VM) using the President's address.
2. Have the [request signed][certlist]. Download.
3. Import into Keychain on mac.
4. Export `.p12` (see [this][sop12]).
5. Create a new [provisioning profile][provisioning] (App Store distribution),
   selecting the new certificate. Download.
6. Update the corresponding [variables][githubactions] for the CI builds. Use
   `cat file.mobileprovision | base64` (change filename when necessary).
7. Try to run `build-ios` workflow to confirm proper configuration.

[certsignreq]: https://developer.apple.com/help/account/create-certificates/create-a-certificate-signing-request
[certlist]: https://developer.apple.com/account/resources/certificates/list
[sop12]: https://stackoverflow.com/questions/9418661/how-to-create-p12-certificate-for-ios-distribution
[provisioning]: https://developer.apple.com/account/resources/profiles/list
[githubactions]: https://github.com/ClubInfoInsaT/application-amicale/settings/environments
