#!/usr/bin/env node
import CommandHelper from "kyle-common/lib/CommandHelper";
import { ConfigTemplate } from "./Config/ConfigTemplate";
import { Schema } from "./Validation/Schema";

new CommandHelper(process.argv)
    .author("kyle S J Mo")
    .description("env=DEV", "在启动服务的命令加上env=DEV参数可区分运行环境，并加载对应环境配置文件")
    .command("init", "初始化项目，生成配置文件模板", () => {
        (new ConfigTemplate(new Schema())).init();
        console.log("init config");
    })
    .command("build", "编译代码(默认使用Webpack编译代码)，开发中。。。", () => {

    })
    .run();