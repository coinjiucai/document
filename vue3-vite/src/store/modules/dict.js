const useDictStore = defineStore(
    'dict',
    {
        state: () => ({
            dict: new Array()
        }),
        actions: {

            getDict(_key) {
                if (_key == null && _key == "") {
                    return null;
                }
                try {
                    for (let i = 0; i < this.dict.length; i++) {
                        if (this.dict[i].key == _key) {
                            return this.dict[i].value;
                        }
                    }
                } catch (e) {
                    return null;
                }
            },

            setDict(_key, value) {
                if (_key !== null && _key !== "") {
                    this.dict.push({
                        key: _key,
                        value: value
                    });
                }
            },

            removeDict(_key) {
                var bln = false;
                try {
                    for (let i = 0; i < this.dict.length; i++) {
                        if (this.dict[i].key == _key) {
                            this.dict.splice(i, 1);
                            return true;
                        }
                    }
                } catch (e) {
                    bln = false;
                }
                return bln;
            },

            cleanDict() {
                this.dict = new Array();
            },

            initDict() {
            }
        }
    })

export default useDictStore