import { X, BookOpen, Download, Share2, Bookmark, CheckCircle } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface ArticleReaderProps {
  title: string;
  category: string;
  readTime: string;
  language: string;
  onClose: () => void;
}

export function ArticleReader({ title, category, readTime, language, onClose }: ArticleReaderProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="bg-green-50 text-green-700">
                {category}
              </Badge>
              <Badge variant="outline">{language}</Badge>
              <span className="text-sm text-gray-500">{readTime} read</span>
            </div>
            <h3 className="font-bold text-2xl">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors ml-4"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Article Content */}
        <div className="p-6 space-y-6">
          {/* Author & Date */}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Dr. Amina Hassan</p>
                <p className="text-xs">Agricultural Extension Officer</p>
              </div>
            </div>
            <span>•</span>
            <span>Published: December 5, 2024</span>
          </div>

          {/* Featured Image */}
          <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <BookOpen className="h-16 w-16 mx-auto mb-2" />
              <p>Article Featured Image</p>
            </div>
          </div>

          {/* Introduction */}
          <div>
            <h4 className="font-bold text-xl mb-3">Introduction</h4>
            <p className="text-gray-700 leading-relaxed">
              Maize is one of Tanzania's most important crops, grown by millions of smallholder farmers 
              across the country. However, many farmers struggle with low yields due to improper farming 
              techniques, poor soil management, and lack of access to quality inputs. This comprehensive 
              guide will walk you through best practices for growing healthy, high-yielding maize crops.
            </p>
          </div>

          {/* Section 1: Land Preparation */}
          <div>
            <h4 className="font-bold text-xl mb-3">1. Land Preparation</h4>
            <p className="text-gray-700 leading-relaxed mb-4">
              Proper land preparation is the foundation of successful maize farming. Start by clearing 
              your field of weeds, crop residues, and debris at least 2 weeks before planting.
            </p>
            
            <Card className="border-gray-200 bg-gray-50">
              <CardContent className="pt-4">
                <h5 className="font-medium text-gray-900 mb-2">Key Steps:</h5>
                <ul className="space-y-2 text-sm text-gray-800">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-gray-700 mt-0.5 flex-shrink-0" />
                    <span>Test soil pH and nutrients</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-gray-700 mt-0.5 flex-shrink-0" />
                    <span>Prepare land 2 weeks before planting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-gray-700 mt-0.5 flex-shrink-0" />
                    <span>Apply recommended fertilizer rates</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Section 2: Seed Selection */}
          <div>
            <h4 className="font-bold text-xl mb-3">2. Choosing the Right Seeds</h4>
            <p className="text-gray-700 leading-relaxed mb-4">
              Seed quality directly affects your final yield. Always purchase certified seeds from 
              authorized dealers to ensure good germination rates and disease resistance.
            </p>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-900">
                <strong>Recommended Varieties for Tanzania:</strong> SC627, H614, H628 (hybrid varieties 
                suitable for medium to high rainfall areas). For drought-prone areas, consider Staha, 
                Lishe H1, or TMV1.
              </p>
            </div>
          </div>

          {/* Section 3: Planting */}
          <div>
            <h4 className="font-bold text-xl mb-3">3. Planting Techniques</h4>
            <p className="text-gray-700 leading-relaxed mb-4">
              Timing and spacing are critical for maize success. Plant at the onset of reliable rains 
              (March-April for long rains, October-November for short rains).
            </p>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <Card>
                <CardContent className="pt-4">
                  <h5 className="font-medium mb-2">Spacing</h5>
                  <p className="text-sm text-gray-700">75cm between rows</p>
                  <p className="text-sm text-gray-700">25cm between plants</p>
                  <p className="text-sm text-gray-700 mt-2">
                    <strong>Density:</strong> ~53,000 plants/hectare
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <h5 className="font-medium mb-2">Depth</h5>
                  <p className="text-sm text-gray-700">Plant 5cm deep</p>
                  <p className="text-sm text-gray-700">2-3 seeds per hole</p>
                  <p className="text-sm text-gray-700 mt-2">
                    <strong>Thin to:</strong> 1 plant per hole after germination
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Section 4: Fertilization */}
          <div>
            <h4 className="font-bold text-xl mb-3">4. Fertilizer Application</h4>
            <p className="text-gray-700 leading-relaxed mb-4">
              Maize is a heavy feeder and requires adequate nutrients throughout its growth cycle.
            </p>

            <div className="space-y-3">
              <Card className="border-green-200">
                <CardContent className="pt-4">
                  <h5 className="font-medium text-green-900 mb-2">Basal Fertilizer (At Planting)</h5>
                  <p className="text-sm text-gray-700">
                    Apply 200kg/hectare of DAP (Diammonium Phosphate) or NPK 23:23:0 at planting time, 
                    placing it 5cm to the side and 5cm below the seed.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-green-200">
                <CardContent className="pt-4">
                  <h5 className="font-medium text-green-900 mb-2">Top-Dressing (3-4 weeks after planting)</h5>
                  <p className="text-sm text-gray-700">
                    Apply 150kg/hectare of Urea (46% N) when maize is knee-high. Apply along the rows, 
                    10cm from plant base, and cover with soil.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Section 5: Weed Control */}
          <div>
            <h4 className="font-bold text-xl mb-3">5. Weed Management</h4>
            <p className="text-gray-700 leading-relaxed mb-4">
              Weeds compete with maize for nutrients, water, and sunlight. Control weeds early and 
              consistently for best results.
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="font-medium">First weeding:</span>
                <span>2-3 weeks after planting (before weeds establish deep roots)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-medium">Second weeding:</span>
                <span>6-7 weeks after planting (combine with top-dressing)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-medium">Alternative:</span>
                <span>Pre-emergence herbicides (consult extension officer for recommendations)</span>
              </li>
            </ul>
          </div>

          {/* Section 6: Pest & Disease */}
          <div>
            <h4 className="font-bold text-xl mb-3">6. Pest and Disease Control</h4>
            <p className="text-gray-700 leading-relaxed mb-4">
              Regular monitoring is essential to catch problems early when they're easier to manage.
            </p>

            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-4">
                <h5 className="font-medium text-red-900 mb-3">Common Threats:</h5>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-medium text-red-900">Fall Armyworm</p>
                    <p className="text-red-800">
                      Scout weekly. Apply pesticides (Chlorantraniliprole or Emamectin benzoate) when 
                      you find 5+ larvae per plant.
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-red-900">Maize Streak Virus</p>
                    <p className="text-red-800">
                      No cure - plant resistant varieties and control leafhopper vectors.
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-red-900">Stalk Borers</p>
                    <p className="text-red-800">
                      Remove and destroy affected plants. Apply granular pesticides in the whorl.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Conclusion */}
          <div>
            <h4 className="font-bold text-xl mb-3">Conclusion</h4>
            <p className="text-gray-700 leading-relaxed">
              By following these best practices - from proper land preparation to timely pest control - 
              you can significantly increase your maize yields. Remember that success in farming comes 
              from consistent attention to detail and responding quickly to problems. Don't hesitate to 
              contact your local extension officer if you encounter challenges.
            </p>
          </div>

          {/* Expert Verification */}
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-900 mb-1">Expert Verified</h4>
                  <p className="text-sm text-green-800">
                    This guide has been reviewed and approved by the <strong>Tanzania Agricultural 
                    Research Institute (TARI)</strong> and follows best practices for Tanzanian 
                    growing conditions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t">
            <Button className="bg-green-600 hover:bg-green-700">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <Button variant="outline">
              <Bookmark className="h-4 w-4 mr-2" />
              Save for Later
            </Button>
            <Button variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              Share Article
            </Button>
            <Button variant="outline">
              Ask AI About This
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}