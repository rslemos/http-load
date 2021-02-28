# [2.0.0](https://github.com/rslemos/http-load/compare/v1.0.1...v2.0.0) (2021-02-28)


### Bug Fixes

* fixup ([03b567c](https://github.com/rslemos/http-load/commit/03b567c7d16b5e245927b8fef2198eccbfdfd819))


### Features

* **http-load:** handling of `ArrayBuffer` response type ([bd17a6c](https://github.com/rslemos/http-load/commit/bd17a6c25b70322ae335771011a1feb18829bc62))
* **http-load:** provide progress reporting to `loading` template ([a5708f3](https://github.com/rslemos/http-load/commit/a5708f3c5e62fd704fa49b45b7e72574a4c92790))


### BREAKING CHANGES

* **http-load:** the `$implicit` for `loading` template used to be the
requested url. Now the `$implicit` is the `HttpEvent` object. The
requested url is available as `rlHttpLoadFrom` in all templates.

## [1.0.1](https://github.com/rslemos/http-load/compare/v1.0.0...v1.0.1) (2021-02-17)


### Bug Fixes

* demo application and README.md ([97da74a](https://github.com/rslemos/http-load/commit/97da74a47e0b9a11a3651f408f5500f6609cb3f9))

# 1.0.0 (2020-10-19)


### Features

* **rlHttpLoad:** scaffolding ([d5dd43f](https://github.com/rslemos/http-load/commit/d5dd43f286c019aef439c7139493f7176fef3366))
* **rlHttpLoad.from:** abort download on destroy ([be3478a](https://github.com/rslemos/http-load/commit/be3478a19a4cc150733d57e679878942e6c14ce9))
* **rlHttpLoad.from:** abort on url change ([f0ee7d3](https://github.com/rslemos/http-load/commit/f0ee7d3e239652d05d531144a08ba561838a63d9))
* **rlHttpLoad.from:** abort on url change to null ([067f004](https://github.com/rslemos/http-load/commit/067f004d1d73771c6a51fca96b6d4c824ded8038))
* **rlHttpLoad.from:** clear view on url change to null ([523161e](https://github.com/rslemos/http-load/commit/523161e5f7f60008d14f2be8e852fed708027b09))
* **rlHttpLoad.from:** download content from url ([5b9dd21](https://github.com/rslemos/http-load/commit/5b9dd213c300425e9301d6d0f65a436b65a977cb))
* **rlHttpLoad.json:** introduce structural directive ([9c7fd2b](https://github.com/rslemos/http-load/commit/9c7fd2b5c204b1f4c38d5e864cd7a22f68437f9b))
* **rlHttpLoad.loading:** display `loading...` ([4975d9d](https://github.com/rslemos/http-load/commit/4975d9ddd83c7854751fdc3c21aff17a30e04d2f))
* **rlHttpLoad.onError:** display network or server error ([459e38e](https://github.com/rslemos/http-load/commit/459e38eeb867fc3a46195b2e90eee87d0a936f10))
* **rlHttpLoad.text:** introduce structural directive ([ef11a1c](https://github.com/rslemos/http-load/commit/ef11a1c542e65841b4d50ee420c9a96796987fc8))
