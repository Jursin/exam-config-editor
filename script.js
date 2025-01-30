new Vue({
    el: '#app',
    data: {
        examName: '',
        message: '',
        room: '',
        examInfos: [],
        autoClearAfterExport: true,
        exportFileName: ''
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
            if (!this.examName.trim()) {
                alert("考试名称不能为空！");
                return;
            }
            if (this.examInfos.length === 0) {
                alert("至少需要添加一条考试信息！");
                return;
            }
            for (let info of this.examInfos) {
                if (!info.name.trim()) {
                    alert("考试科目名称不能为空！");
                    return;
                }
                if (!info.start || !info.end) {
                    alert("考试开始时间和结束时间不能为空！");
                    return;
                }
                if (new Date(info.start) >= new Date(info.end)) {
                    alert("考试开始时间必须早于结束时间！");
                    return;
                }
            }

            this.downloadJsonFile();

            if (this.autoClearAfterExport) {
                this.clearConfig();
            }
        },
        downloadJsonFile() {
            let fileName = this.exportFileName.trim() || 'exam_config';
            fileName = fileName.replace(/[\s\/\\:*?"<>|]/g, "");
            const blob = new Blob([this.jsonConfig], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName + '.json';
            a.click();
            URL.revokeObjectURL(url);
        },
        confirmImport() {
            if (this.examName || this.message || this.room || this.examInfos.length > 0) {
                if (!confirm("当前配置正在编辑，确定要导入新配置吗？")) {
                    return;
                }
            }

            document.getElementById('fileInput').value = '';
            document.getElementById('fileInput').click();
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

                    alert("配置导入成功！");
                } catch (error) {
                    alert("配置文件格式错误，请检查后再试！");
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