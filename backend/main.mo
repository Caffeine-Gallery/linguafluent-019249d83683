import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import Text "mo:base/Text";

actor {
  // Define a type for storing translations
  type Translation = {
    original: Text;
    translated: Text;
    targetLanguage: Text;
  };

  // Create a stable variable to store translations
  stable var translationsStable : [Translation] = [];

  // Buffer to store translations
  var translations = Buffer.Buffer<Translation>(0);

  // Initialize the buffer with stable data
  public func init() : async () {
    translations := Buffer.fromArray<Translation>(translationsStable);
  };

  // Add a new translation to the history
  public func addTranslation(original: Text, translated: Text, targetLanguage: Text) : async () {
    let newTranslation : Translation = {
      original;
      translated;
      targetLanguage;
    };
    translations.add(newTranslation);
  };

  // Get all translations
  public query func getTranslations() : async [Translation] {
    return Buffer.toArray(translations);
  };

  // Pre-upgrade hook to preserve data
  system func preupgrade() {
    translationsStable := Buffer.toArray(translations);
  };

  // Post-upgrade hook to restore data
  system func postupgrade() {
    translations := Buffer.fromArray<Translation>(translationsStable);
  };
}
