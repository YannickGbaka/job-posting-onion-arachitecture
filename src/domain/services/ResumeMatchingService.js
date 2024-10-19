class ResumeMatchingService {
  static extractKeywords(jobOffer) {
    const cleanedOffer = jobOffer
      .toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, " ");
    const words = cleanedOffer.split(/\s+/);
    const stopWords = new Set([
      "le",
      "la",
      "les",
      "un",
      "une",
      "des",
      "et",
      "ou",
      "mais",
      "donc",
      "car",
      "pour",
      "dans",
      "sur",
      "avec",
      "sans",
      "vous",
      "nous",
      "ils",
      "elles",
      "est",
      "sont",
      "être",
      "avoir",
      "faire",
      "plus",
      "moins",
      "très",
      "peu",
      "beaucoup",
      "trop",
      "pas",
      "ne",
      "ni",
      "que",
      "qui",
      "quoi",
      "dont",
      "où",
      "comment",
      "pourquoi",
      "quand",
      "quel",
      "quelle",
      "quels",
      "quelles",
    ]);

    const keywords = words.filter(
      (word) => word.length > 2 && !stopWords.has(word) && !/^\d+$/.test(word)
    );

    for (let i = 0; i < words.length - 1; i++) {
      if (!stopWords.has(words[i]) && !stopWords.has(words[i + 1])) {
        keywords.push(`${words[i]} ${words[i + 1]}`);
      }
    }

    return Array.from(new Set(keywords));
  }

  static isJobOfferMatch(resumeContent, jobOffer) {
    const keywords = this.extractKeywords(jobOffer);
    const lowerContent = resumeContent.toLowerCase();

    let matchScore = 0;
    const matchedKeywords = [];

    keywords.forEach((keyword) => {
      const regex = new RegExp(`\\b${this.escapeRegExp(keyword)}\\w*\\b`, "i");
      if (regex.test(lowerContent)) {
        matchScore++;
        matchedKeywords.push(keyword);
      }
    });

    const threshold = keywords.length * 0.1;
    const isMatch = matchScore >= threshold;

    return { isMatch, score: matchScore, matchedKeywords, keywords };
  }

  static escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
}

module.exports = ResumeMatchingService;
