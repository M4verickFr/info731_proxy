# 🛡️ Proxy with RSA

Web communications can be monitored and listened to. In order to deal with this we want to implement a mechanism to encrypt the traffic at the entrance of a domain where the traffic is likely to be listened and to decrypt it at the exit. The objective of this project is the development of this proxy. The proxy receives http requests from a web browser that has been configured to use a proxy, and encrypts these requests before sending them to the output proxy. The output proxy makes the http request to the web server instead of the web browser, receives the encrypted response and sends it back to the source proxy, which finally sends it back to the browser that displays the requested page.

## 👷 How does it work?

![image](https://user-images.githubusercontent.com/54810120/151880997-72b55f17-41a6-462e-8c6f-ef312aad28f2.png)

## 🛠 Installation

This project is intended to work with Nodejs, to install the project you need to clone the repository:

```
git clone git@github.com:M4verickFr/info731_crypto.git
```

Then install the dependencies:

```
yarn
```

And finaly generate RSA Keys:

```
node generateKeys.js
```


## 🕐 Quickstart

Starts proxies:

```bash
node serverProxy.js
```

```bash
node clientProxy.js
```

Then config your browser to use http://localhost:8080 as Proxy Server. I personally use **SwitchyOmega** extension on Chrome.


## 💪 Authors of this project

* **PERROLLAZ Maverick** _alias_ [@M4verickFr](https://github.com/M4verickFr)
* **CAULLIREAU Dorian** _alias_ [@caullird](https://github.com/caullird)
* **MASSIT Clément** _alias_ [@clement-massit](https://github.com/clement-massit)
