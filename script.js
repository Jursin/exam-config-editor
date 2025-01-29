new Vue({
    el: '#app',
    data: {
        examName: '',
        message: '',
        room: '',
        examInfos: [
        ],
        autoClearAfterExport: true
    },
    computed: {
        jsonConfig() {
            return JSON.stringify({
                examName: this.examName,
                message: this.message,
                room: this.room,
                examInfos: this.examInfos
            }, null, 2);
        }
    },
    methods: {
        addExamInfo() {
            this.examInfos.push({ name: '', start: '', end: '' });
        },
        removeExamInfo(index) {
            this.examInfos.splice(index, 1);
        },
        exportConfig() {
            const blob = new Blob([this.jsonConfig], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'exam_config.json';
            a.click();
            URL.revokeObjectURL(url);

            if (this.autoClearAfterExport) {
                this.clearConfig();
            }
        },
        confirmImport() {
            if (this.examName || this.message || this.room || this.examInfos.length > 0) {
                if (confirm("当前配置正在编辑，确定要导入新配置吗？")) {
                    document.getElementById('fileInput').click();
                }
            } else {
                document.getElementById('fileInput').click();
            }
        },
        importConfig(event) {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    this.examName = data.examName || '';
                    this.message = data.message || '';
                    this.room = data.room || '';
                    this.examInfos = Array.isArray(data.examInfos) ? data.examInfos : [];
                } catch (error) {
                    alert("配置文件格式错误");
                }
            };
            reader.readAsText(file);
        },
        clearConfig() {
            if (confirm("确定要清空所有配置吗？")) {
                this.examName = '';
                this.message = '';
                this.room = '';
                this.examInfos = [];
            }
        }
    }
});