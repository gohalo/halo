-- 等待插件加载完成
vim.defer_fn(function()
	-- 通过清空 'Conform' 这个 autocmd 组来禁用保存时格式化
	vim.api.nvim_create_augroup("Conform", { clear = true })
end, 100)
