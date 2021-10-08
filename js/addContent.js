'use strict';

class addContent{
    #table;
    #tableRows;
    #editImage;
    #deleteImage;
    #SubjectInput;
    #triangleImage;
    #findAllMatches;
    #descriptionInput;
    #descriptionBtnText;
    #SearchReferencesInput;
    #regexReplaceValuesArray;

    constructor() {
        this.#findAllMatches = 'g';
        this.#descriptionBtnText = " Press for description ";
        this.#tableRows = document.getElementsByTagName("tr");
        this.#table = document.getElementsByTagName("table")[0];
        this.#SearchReferencesInput = document.getElementById("SubjectInput");
        this.#SubjectInput = document.getElementById("SearchReferencesInput");
        this.#descriptionInput = document.getElementById("descriptionInputText");
        this.#editImage = "<img class=\"smallImages\" src=\"img/edit.png\" alt=\"edit\">";
        this.#deleteImage = "<img class=\"smallImages\" src=\"img/delete.png\" alt=\"delete\">";
        this.#regexReplaceValuesArray = [['\'', ''], ['\"', ''], ['<i>', ''],  ['</i>', ''], ['<b>', ''], ['</b>', ''], ['<u>', ''],
        ['</u>', ''], ['&lt;i&gt;', ''], ['&lt;/i&gt;', ''], ['&lt;b&gt;', ''], ['&lt;/b&gt;', ''], ['&lt;u&gt;', ''], ['&lt;/u&gt;', ''],
        ['<', '&lt;'], ['>', '&gt;'], ['\n', '<br>'], ['#i#', '<i>'], ['#/i#', '</i>'], ['#b#', '<b>'], ['#/b#', '</b>'], ['#u#', '<u>'], ['#/u#', '</u>']];
        this.#triangleImage = "<img class=\"smallImages\" src=\"img/triangle.png\" alt=\"highlightThisIsAButtonTriangle\"/>";
    }

    showOrHideWindow() {
        this.#clear();
        addUpdateWindow.style.display = addUpdateWindow.style.display === '' ? 'none' : '';
    }
    
    execute() {
        this.#changeAllInputToHtmlFriendly();
        if (this.#checkIfCanBeAddOrEdited() || this.#checkIfEditOrAdd())
            return this.showOrHideWindow();;
        this.#createSearchRow();
        this.#createDescriptionRow();
        this.showOrHideWindow();
    }

    #checkIfCanBeAddOrEdited() {
        let isSubjectEmpty = this.#SearchReferencesInput.value == '';
        if(isSubjectEmpty)
            alert("You must at least have subject to be able submitting!");
        return isSubjectEmpty;
    }

    #changeAllInputToHtmlFriendly() {
        this.#SubjectInput.value = this.#editTextForJSUse(this.#SubjectInput.value);
        this.#SearchReferencesInput.value = this.#editTextForJSUse(this.#SearchReferencesInput.value);
        this.#descriptionInput.value = this.#editTextForJSUse(this.#descriptionInput.value);
    }

    #editTextForJSUse(text) {
        for (let replaceValuesArrayIndex = 0; replaceValuesArrayIndex < this.#regexReplaceValuesArray.length; replaceValuesArrayIndex -= -1)
            text = this.#regexChangeTextToFitJavascriptOrHTML(text, replaceValuesArrayIndex);
        return text.trim();
    }

    #regexChangeTextToFitJavascriptOrHTML(text, replaceValuesArrayIndex) {
        let regexExpression = new RegExp(this.#regexReplaceValuesArray[replaceValuesArrayIndex][ENUM.regexChangeFromIndex], this.#findAllMatches);
        return text.replace(regexExpression, this.#regexReplaceValuesArray[replaceValuesArrayIndex][ENUM.regexChangeToIndex]);
    }

    #checkIfEditOrAdd() {
        for (let rowIndex = 0; rowIndex < this.#tableRows.length; rowIndex -= -1)
            if (this.#addOrEditValidator(rowIndex))
                return this.#editOnOccurrence(rowIndex);
        return false;
    }

    #addOrEditValidator(rowIndex) {
        return this.#tableRows[rowIndex].id == '' &&
        this.#tableRows[rowIndex].children[ENUM.SubjectCellIndex].innerHTML.trim().toLowerCase() ==
        this.#SearchReferencesInput.value.trim().toLowerCase();
    }

    #editOnOccurrence(rowIndex) {
        this.#tableRows[rowIndex].children[ENUM.SearchReferencesCellIndex].innerHTML = this.#SubjectInput.value.trim();
        this.#tableRows[rowIndex].children[ENUM.SubjectCellIndex].innerHTML = this.#SearchReferencesInput.value.trim();
        this.#tableRows[rowIndex + ENUM.nextRow].children[ENUM.SearchReferencesCellIndex].innerHTML = this.#descriptionInput.value.trim();
        this.#tableRows[rowIndex + ENUM.nextRow].id = this.#SearchReferencesInput.value.trim();
        return this.#clear();
    }

    #createSearchRow() {
        let searchRow = document.createElement('tr');
        searchRow.appendChild(this.#createNewCellWithData(this.#SubjectInput.value));
        searchRow.appendChild(this.#createNewCellWithData(this.#SearchReferencesInput.value));
        searchRow.appendChild(this.#createBtnCell(this.#triangleImage + this.#descriptionBtnText + this.#triangleImage, "showDescription(\'" + this.#SearchReferencesInput.value + "\')"));
        searchRow.appendChild(this.#createBtnCell(this.#editImage, "editThis(\'" + this.#SearchReferencesInput.value + "\')"));
        searchRow.appendChild(this.#createBtnCell(this.#deleteImage, "deleteThis(\'" + this.#SearchReferencesInput.value + "\')"));
        this.#table.appendChild(searchRow);
    }

    #createNewCellWithData(cellContent) {
        let newCell = document.createElement('td');
        newCell.setAttribute("dir", "auto");
        newCell.innerHTML = cellContent;
        return newCell;
    }

    #createBtnCell(btnVisual, btnFunction) {
        let descriptionBtnCell = document.createElement('td');
        descriptionBtnCell.appendChild(this.#createBtn(btnVisual, btnFunction));
        return descriptionBtnCell;
    }

    #createBtn(btnVisual, btnFunction) {
        let DescriptionBtn = document.createElement('button'); 
        DescriptionBtn.innerHTML = btnVisual;
        DescriptionBtn.setAttribute('onclick', btnFunction);
        return DescriptionBtn;
    }

    #createDescriptionRow() {
        let descriptionRow = this.#createRowForDescription();
        descriptionRow.appendChild(this.#createDescriptionContent());
        this.#table.appendChild(descriptionRow);
    }

    #createRowForDescription() {
        let descriptionRow = document.createElement('tr');
        descriptionRow.setAttribute("dir", "auto");
        descriptionRow.style.display = 'none';
        descriptionRow.id = this.#SearchReferencesInput.value;
        return descriptionRow;
    }

    #createDescriptionContent() {
        let rowContent = this.#createNewCellWithData(this.#descriptionInput.value);
        rowContent.colSpan = ENUM.descriptionRowSpanLength;
        return rowContent;
    }

    #clear() {
        this.#SubjectInput.value = '';
        this.#SearchReferencesInput.value = '';
        this.#descriptionInput.value = '';
        return true;
    }
}