class StaticCustomSearchPlugin {
	constructor (API, name, config) {
		this.API = API;
		this.name = name;
		this.config = config;
	}

	addInsertions () {
		this.API.addInsertion('customSearchInput', this.addSearchInput, 1, this);
		this.API.addInsertion('customSearchContent', this.addSearchContent, 1, this);
	}

	addSearchInput (rendererInstance, context) {
		let searchUrl = '';
		let searchAutofocus = '';
		
		if (rendererInstance.globalContext && rendererInstance.globalContext.website) {
			searchUrl = rendererInstance.globalContext.website.searchUrl;
		}

		if (this.config.searchAutofocus) {
			searchAutofocus = `autofocus`;
		}

		let output = `<form action="${searchUrl}" class="search__form">
                     <input
                        class="search__input"
                        type="search"
                        name="${this.config.searchParam}"
                        placeholder="${this.config.searchPlaceholder}" 
                        aria-label="${this.config.searchPlaceholder}"
                        ${searchAutofocus}/>
						<button type="submit" class="search__button"><span>
						  ${this.config.searchSubmitLabel}</span>
						</button>
                  </form>`;

		return output;
	}

	addSearchContent (rendererInstance, context) {
		let searchUrl = '';
		
		if (rendererInstance.globalContext && rendererInstance.globalContext.website) {
			searchUrl = rendererInstance.globalContext.website.searchUrl;
		}

		let output = `
			<form 
				action="${searchUrl}" 
				class="search-page-form">
				<input
					type="search"
					name="${this.config.searchParam}"
					placeholder="${this.config.searchPlaceholder}"
					class="search-page-input"/>
					<button type="submit" class="search-page-button"><span>
					  ${this.config.searchSubmitLabel}</span>
					</button>
			</form>
			<div id="search-results"></div>
			<script>
			(async function () {
				console.log("${this.config.jsonFeedUrl}");
				console.log("${this.config.searchParam}");
			  
				let url = "${this.config.jsonFeedUrl}";
				let response = await fetch(url);
				let jsonData = await response.json();
			  
				const params = new URLSearchParams(window.location.search)
				let searchTerm = params.get("${this.config.searchParam}");
				let results = [];
			  
				jsonData.items.forEach((item) => {
				  let title = item.title.toLowerCase();
				  let summary = item.summary.toLowerCase();
				  let url = item.url;
			  
				  if (title.includes(searchTerm.toLowerCase()) || summary.includes(searchTerm.toLowerCase())) {
					results.push(item);
				  }
				});
			  
				let elm = document.querySelector("#search-results");
				if (results.length > 0) {
				  results.forEach((result)=>{
					console.log(result);
					elm.innerHTML += '<h5><a href="'+ result.url +'">' + result.title + '</a></h5><p>' + result.summary + '</p>'
				  });
				} else {
				  elm.innerHTML = '<p>No Results Found</p>';
				}
			  })();						
			</script>
		`;

		return output;
	}
}

module.exports = StaticCustomSearchPlugin;
