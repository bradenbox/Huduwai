'use strict'

function Huduwai () {

    this.makeSuggestion = function(name, topic)   {

    var brain = new Brain();
    
    var relatedWords = new RelatedWords().getRelatedWords(topic);

    for (i = 0; i < relatedWords.length; i++) {
      var aWord = relatedWords.get[i];
      if (!brain.containsKey(aWord)){
        var newKeyword = new Keyword(aWord);
        brain.put(aWord, newKeyword);
      }
      brain.get(aWord).addDatapoint(tq.getPerson(), aRelatedPair);
    }

   }

   this.getRelatedWords = function (tq) {

    var possibleAnswers = [];

    for (aWord in tq.getQuestionWords()){
      var aPair = new Pair();
      aPair.setFirst(aWord);
      aPair.setSecond(null);

      possibleAnswers.push(aPair);  
    }
    
    for (aWord in tq.getQuestionWords()){
      
      var idxWordNoun = getAllDefinitions(aWord, POS.NOUN);
      var idxWordVerb = getAllDefinitions(aWord, POS.VERB);
      var idxWordAdj = getAllDefinitions(aWord, POS.ADJECTIVE);
    
      var wordList = [];
      wordList.push(idxWordNoun);
      wordList.push(idxWordVerb);
      wordList.push(idxWordAdj);
      
      for (idxWord in wordList){
        if (idxWord == null ){
          continue;
        }
        
        for (anotherWord in getRelatedWords(idxWord, 'HYPERNYM')){
          var aPair = new Pair();
          aPair.setFirst(anotherWord);
          aPair.setSecond('HYPERNYM');
          possibleAnswers.push(aPair);  
        }

        for (anotherWord in getRelatedWords(idxWord, 'HYPONYM')){
          var aPair = new Pair();
          aPair.setFirst(anotherWord);
          aPair.setSecond('HYPONYM');
          possibleAnswers.push(aPair); 
        }
      }
    }
    
    return possibleAnswers;
  }

  this.getRelatedWords = function (idxWord, pointerType) {
    
    var allRelated = [];
    
    for (meaning in idxWord.getWordIDs()){
      var word = dictionary.getWord (meaning);
      var synset = word.getSynset ();
      
      var relatedList = synset.getRelatedSynsets(type);
      
      for( sid in relatedList ){
        var words = dictionary.getSynset(sid).getWords ();
        
        for(aword in words){
          allRelated.add(aword.getLemma());
        }
      }
    }

    return allRelated;
  }


 this.askAbout = function(topic) {
     

 }
  
}


