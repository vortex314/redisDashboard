<template>
    <div>
        <v-jsoneditor v-model="json" :options="options" :plus="false" height="400px" width="600px" @error="onError" />
    </div>
</template>

<script>
import VJsoneditor from 'v-jsoneditor'

export default {
    name: "ConfigEditor",
    components: {
        VJsoneditor
    },
    props: {
        config: Object
    },
    watch: { // copy prop to json value of v-jsoneditor
        config: function (newVal) { // watch it
            this.json = newVal;
        }
    },
    data() {
        var self = this;
        return {
            json: this.config,
            options: {
                onChangeText(text) {
                    var js = JSON.parse(text);
                    if (js != undefined)
                        self.$emit('configChanged', js);
                },
                mode: 'code',
            }
        }
    },
    methods: {
        onError() {
            console.log("error");
        }
    },
}
</script>

<style>
</style>